'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Download,
  UploadCloudIcon,
  XIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import Papa from 'papaparse'
import { motion, AnimatePresence, easeInOut } from 'framer-motion'

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
  externalReference?: string
  deliveryTiming?: 'SCHEDULE' | 'SEND_NOW'
  scheduledPickupAt?: string
  items: OrderItem[]
}

export default function ImportOrdersModal() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<{
    type: 'error' | 'success'
    text: string
  } | null>(null)
  const [validated, setValidated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [isDragging, setIsDragging] = useState(false)

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
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
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

          // Check for missing columns
          const missingColumns = requiredColumns.filter(
            (c) => !fileColumns.includes(c),
          )
          if (missingColumns.length)
            return resolve({ valid: false, errors: missingColumns })

          const ordersMap = new Map<string, Order>()
          for (const row of rows) {
            const key = row.idempotencyKey?.trim()
            if (!key) continue

            // parse items
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
                externalReference: row.externalReference,
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

  const handleImport = () => {
    if (!file || !validated) return
    console.log('Imported Orders:', orders)
    setFile(null)
    setValidated(false)
    setMessage(null)
    setOrders([])
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" leftIcon={<Download size={14} />} size="sm">
          Import
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Orders from CSV</DialogTitle>
          <DialogDescription className="text-[13px]">
            Upload a CSV file. The "items" column must be a JSON array of
            objects: {`[{ name, quantity, description }]`}. If deliveryTiming is
            "SCHEDULE", scheduledPickupAt is mandatory.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          {/* Drag & Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-md border border-dashed p-6 text-center cursor-pointer transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}`}
          >
            {!file ? (
              <>
                <UploadCloudIcon
                  className="mx-auto mb-2 text-muted-foreground"
                  size={32}
                />
                <label
                  htmlFor="file"
                  className="text-[13px] text-muted-foreground cursor-pointer"
                >
                  Drag & drop CSV here or click to browse
                </label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <p className="truncate w-full">{file.name}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
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
                className={`flex items-center gap-2 text-[13px] px-3 py-2 rounded-md font-medium
                  ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
              >
                {message.type === 'success' ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-muted-foreground">
            Required columns: {requiredColumns.join(', ')}. "items" must be a
            JSON array. "deliveryTiming" must be SCHEDULE or SEND_NOW. If
            SCHEDULE, scheduledPickupAt is required.
          </p>
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {file &&
            (!validated ? (
              <Button size="sm" onClick={handleValidate}>
                Validate CSV
              </Button>
            ) : (
              <Button size="sm" onClick={handleImport}>
                Import
              </Button>
            ))}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
