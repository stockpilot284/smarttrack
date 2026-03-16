'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pen, Truck, UploadCloud, X, Info } from 'lucide-react'
import { toast } from 'sonner'
import { VehicleType, VehicleDetail } from '@/types/vehicle.type'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface EditVehicleSheetProps {
  vehicle: VehicleDetail
  trigger?: React.ReactNode
  onVehicleUpdated?: (
    data: Partial<Omit<VehicleDetail, 'id' | 'plateNumber'>>,
  ) => void
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export function EditVehicleSheet({
  vehicle,
  trigger,
  onVehicleUpdated,
}: EditVehicleSheetProps) {
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState(vehicle.model)
  const [type, setType] = useState<VehicleType>(vehicle.type)
  const [lastServiceDate, setLastServiceDate] = useState(
    vehicle.lastServiceDate || '',
  )
  const [nextServiceDue, setNextServiceDue] = useState(
    vehicle.nextServiceDue || '',
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(
    vehicle.imageUrl || null,
  )
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Determine if vehicle is editable
  const isEditable = !(
    vehicle.status === 'ACTIVE' && vehicle.availability === 'IN_USE'
  )
  const disabledReason = !isEditable
    ? 'Cannot edit while vehicle is active and in use'
    : ''

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const fakeEvent = {
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>
      handleImageChange(fakeEvent)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedData = {
      model,
      type,
      lastServiceDate: lastServiceDate || undefined,
      nextServiceDue: nextServiceDue || undefined,
      imageUrl: imagePreview || undefined,
    }

    toast.success(`Vehicle ${vehicle.plateNumber} updated successfully`)
    setOpen(false)
    onVehicleUpdated?.(updatedData)
    setLoading(false)
  }

  return (
    <TooltipProvider>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Pen size={14} />}
                disabled={!isEditable}
                onClick={() => setOpen(true)}
              >
                Edit Details
              </Button>
            </TooltipTrigger>
            {!isEditable && (
              <TooltipContent side="top">
                <p className="text-xs">{disabledReason}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg py-6 overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Edit Vehicle</SheetTitle>
            <SheetDescription>Update vehicle information.</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-6 px-4">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Vehicle Image</Label>
              <div
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors cursor-pointer',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50',
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <div className="relative group w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 rounded-md mx-auto object-cover w-1/2"
                    />
                    <div
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      <span className="text-foreground text-xs flex items-center gap-1 bg-accent/80 p-2 rounded-xl">
                        Change image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="model" required>
                Model
              </Label>
              <Input
                id="model"
                placeholder="e.g. Toyota Hiace"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>

            {/* Plate Number (read‑only) */}
            <div className="space-y-2">
              <Label htmlFor="plateNumber">Plate Number</Label>
              <Input
                id="plateNumber"
                value={vehicle.plateNumber}
                disabled
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <Select
                value={type}
                onValueChange={(value: VehicleType) => setType(value)}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VAN">Van</SelectItem>
                  <SelectItem value="TRUCK">Truck</SelectItem>
                  <SelectItem value="PICKUP">Pickup</SelectItem>
                  <SelectItem value="BIKE">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Last Service Date with tooltip */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="lastServiceDate">Last Service Date</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">
                      The date when the vehicle was last serviced. Leave blank
                      if unknown.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="lastServiceDate"
                type="date"
                value={lastServiceDate}
                onChange={(e) => setLastServiceDate(e.target.value)}
              />
            </div>

            {/* Next Service Due with tooltip */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="nextServiceDue">Next Service Due</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">
                      The date when the next service is due. An overdue badge
                      will appear if this date is past.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="nextServiceDue"
                type="date"
                value={nextServiceDue}
                onChange={(e) => setNextServiceDue(e.target.value)}
              />
            </div>

            <SheetFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                size="sm"
                loading={loading}
              >
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}
