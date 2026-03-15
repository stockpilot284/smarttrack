import * as React from 'react'
import { useState, useRef } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Download,
  UploadCloudIcon,
  XIcon,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import Papa from 'papaparse'
import { motion, AnimatePresence, easeInOut } from 'framer-motion'
import { useAppStore } from '@/lib/store/zustand'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export interface OrderItem {
  name: string
  quantity: number
  description?: string
}

export interface Order {
  idempotencyKey: string
  customerName: string
  customerEmail: string
  pickupLocation: string
  pickupContactName: string
  pickupContactPhone: string
  dropoffLocation: string
  recipientName: string
  recipientPhone: string
  orderLabel?: string
  packageWeight?: string
  deliveryNotes?: string
  deliveryTiming?: 'SCHEDULE' | 'SEND_NOW'
  scheduledPickupAt?: string

  items: OrderItem[]
}

export default function ImportOrdersSheet() {
  const openUpgradeModal = useAppStore((state) => state.openUpgradeModal)
  const allowBulkImportOrders = useAppStore(
    (state) => state.plan.features.bulkImportOrders,
  )

  const [open, setOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{
    type: 'error' | 'success'
    text: string
  } | null>(null)
  const [validated, setValidated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Define allowed columns
  const requiredColumns = [
    'idempotencyKey',
    'customerName',
    'customerEmail',
    'pickupLocation',
    'pickupContactName',
    'pickupContactPhone',
    'dropoffLocation',
    'recipientName',
    'recipientPhone',
    'items',
  ]

  const optionalColumns = [
    'orderLabel',
    'packageWeight',
    'deliveryNotes',
    'deliveryTiming',
    'scheduledPickupAt',
  ]

  const allowedColumns = [...requiredColumns, ...optionalColumns]

  // Check feature before opening sheet
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !allowBulkImportOrders) {
      openUpgradeModal({ featureName: 'bulkImportOrders' })
      return
    }
    setOpen(newOpen)
    if (!newOpen) {
      // Reset state on close
      setFile(null)
      setMessage(null)
      setValidated(false)
      setOrders([])
      setShowHelp(false)
    }
  }

  /** ---------- File Handler ---------- */
  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setMessage({ type: 'error', text: 'Only CSV files are allowed.' })
      return
    }
    setFile(selectedFile)
    setMessage(null)
    setValidated(false)
    setOrders([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  /** ---------- Drag & Drop ---------- */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  /** ---------- CSV Validation ---------- */
  const validateCSV = (
    csvFile: File,
  ): Promise<{ valid: boolean; errors?: string[]; orders?: Order[] }> => {
    return new Promise((resolve) => {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as any[]
          const fileColumns = results.meta.fields || []

          // 1. Check for unrecognized columns
          const extraColumns = fileColumns.filter(
            (col) => !allowedColumns.includes(col),
          )
          if (extraColumns.length > 0) {
            return resolve({
              valid: false,
              errors: [
                `Unrecognized columns: ${extraColumns.join(', ')}. Allowed columns: ${allowedColumns.join(', ')}`,
              ],
            })
          }

          // 2. Check for missing required columns
          const missingColumns = requiredColumns.filter(
            (c) => !fileColumns.includes(c),
          )
          if (missingColumns.length) {
            return resolve({
              valid: false,
              errors: missingColumns,
            })
          }

          const ordersMap = new Map<string, Order>()
          for (const row of rows) {
            const key = row.idempotencyKey?.trim()
            if (!key) continue

            // Parse items
            let items: OrderItem[] = []
            try {
              items = JSON.parse(row.items)
              if (!Array.isArray(items) || items.length === 0) {
                return resolve({
                  valid: false,
                  errors: ['items column must be a non-empty array'],
                })
              }
            } catch {
              return resolve({
                valid: false,
                errors: ['items column must be valid JSON array'],
              })
            }

            // Validate deliveryTiming
            const timing = row.deliveryTiming?.trim()
            if (timing && timing !== 'SCHEDULE' && timing !== 'SEND_NOW') {
              return resolve({
                valid: false,
                errors: [
                  `deliveryTiming must be either "SCHEDULE" or "SEND_NOW"`,
                ],
              })
            }

            // If scheduled, check scheduledPickupAt
            if (timing === 'SCHEDULE' && !row.scheduledPickupAt) {
              return resolve({
                valid: false,
                errors: [
                  `scheduledPickupAt is required when deliveryTiming is SCHEDULE`,
                ],
              })
            }

            if (!ordersMap.has(key)) {
              ordersMap.set(key, {
                idempotencyKey: key,
                customerName: row.customerName,
                customerEmail: row.customerEmail,
                pickupLocation: row.pickupLocation,
                pickupContactName: row.pickupContactName,
                pickupContactPhone: row.pickupContactPhone,
                dropoffLocation: row.dropoffLocation,
                recipientName: row.recipientName,
                recipientPhone: row.recipientPhone,
                orderLabel: row.orderLabel,
                packageWeight: row.packageWeight,
                deliveryNotes: row.deliveryNotes,
                deliveryTiming: timing,
                scheduledPickupAt: row.scheduledPickupAt,
                items,
              })
            }
          }

          resolve({ valid: true, orders: Array.from(ordersMap.values()) })
        },
        error: (err) => resolve({ valid: false, errors: [err.message] }),
      })
    })
  }

  const handleValidate = async () => {
    if (!file) return
    const result = await validateCSV(file)
    if (!result.valid) {
      setMessage({
        type: 'error',
        text: `CSV Error: ${result.errors?.join(', ')}`,
      })
      setValidated(false)
      return
    }
    setOrders(result.orders || [])
    setMessage({
      type: 'success',
      text: `CSV is valid! ${file.name} ready to import.`,
    })
    setValidated(true)
  }

  const handleImport = async () => {
    if (!file || !validated) return

    // Simulate API call
    const importPromise = new Promise((resolve) => setTimeout(resolve, 1500))

    toast.promise(importPromise, {
      loading: 'Importing orders...',
      success: `Successfully imported ${orders.length} order${orders.length > 1 ? 's' : ''}`,
      error: 'Failed to import orders',
    })

    await importPromise
    console.log('Imported Orders:', orders)
    // Here you would send the orders to your real API
    setOpen(false)
  }

  const messageVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: easeInOut },
    },
    exit: { opacity: 0, y: 8, transition: { duration: 0.15, ease: easeInOut } },
  }

  // Build help content from fields
  const helpSections = [
    {
      title: 'Required Columns',
      items: requiredColumns.map((col) => (
        <li key={col} className="text-sm">
          <Badge variant="outline" className="mr-2 font-mono">
            {col}
          </Badge>
          <span className="text-muted-foreground">
            {col === 'items'
              ? 'JSON array of objects with name, quantity, description'
              : 'Text field'}
          </span>
        </li>
      )),
    },
    {
      title: 'Optional Columns',
      items: optionalColumns.map((col) => (
        <li key={col} className="text-sm text-muted-foreground">
          {col}
          {col === 'deliveryTiming' && ' (SCHEDULE or SEND_NOW)'}
          {col === 'scheduledPickupAt' &&
            ' (required if deliveryTiming=SCHEDULE)'}
        </li>
      )),
    },
    {
      title: 'Notes',
      content: (
        <p className="text-sm text-muted-foreground">
          The <strong>items</strong> column must contain a JSON array, e.g.:{' '}
          <code className="text-xs bg-muted p-1 rounded">
            [{'{"name":"Item1","quantity":2}'}]
          </code>
        </p>
      ),
    },
  ]

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="secondary" leftIcon={<Download size={14} />} size="sm">
          Import
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 pt-6 flex flex-col"
      >
        <SheetHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <SheetTitle>Import Orders from CSV</SheetTitle>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => setShowHelp(!showHelp)}
              className="text-muted-foreground"
            >
              <HelpCircle size={16} />
            </Button>
          </div>
          <SheetDescription>
            Upload a CSV file with the required columns.
          </SheetDescription>
        </SheetHeader>

        <Collapsible
          open={showHelp}
          onOpenChange={setShowHelp}
          className="px-6"
        >
          <CollapsibleContent className="space-y-4 pb-4">
            <Separator />
            <div className="space-y-3 text-sm">
              {helpSections.map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-medium mb-1">{section.title}</h4>
                  {section.items ? (
                    <ul className="list-disc list-inside space-y-1">
                      {section.items}
                    </ul>
                  ) : (
                    section.content
                  )}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Drag & Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-lg border border-dashed p-8 text-center cursor-pointer transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
          >
            {!file ? (
              <>
                <UploadCloudIcon
                  className="mx-auto mb-3 text-muted-foreground"
                  size={40}
                />
                <span className="text-sm text-muted-foreground">
                  Drag & drop CSV here or click to browse
                </span>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm font-medium truncate w-full">
                  {file.name}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setMessage(null)
                    setValidated(false)
                    setOrders([])
                  }}
                  leftIcon={<XIcon size={12} />}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Validation message */}
          <AnimatePresence>
            {message && (
              <motion.div
                key={message.text}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`flex items-center gap-2 text-sm px-4 py-3 rounded-md font-medium
                  ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'}`}
              >
                {message.type === 'success' ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SheetFooter className="px-6 py-4 border-t flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          {file &&
            (!validated ? (
              <Button
                size="sm"
                onClick={handleValidate}
                className="w-full sm:w-auto"
              >
                Validate CSV
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleImport}
                className="w-full sm:w-auto"
              >
                Import {orders.length} order{orders.length > 1 ? 's' : ''}
              </Button>
            ))}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
