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
import { Truck, UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store/zustand'
import { VehicleType } from '@/types/vehicle.type'
import { cn } from '@/lib/utils'

export type Vehicle = {
  id: string
  model: string
  plateNumber: string
  imageUrl?: string
  type: VehicleType
}

interface AddVehicleSheetProps {
  trigger?: React.ReactNode
  currentVehicleCount?: number
  onVehicleAdded?: (
    data: Omit<Vehicle, 'id' | 'status' | 'availability'>,
  ) => void
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export function AddVehicleSheet({
  trigger,
  currentVehicleCount = 0,
  onVehicleAdded,
}: AddVehicleSheetProps) {
  const [open, setOpen] = useState(false)
  const [model, setModel] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [type, setType] = useState<VehicleType>('VAN')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxVehicles = useAppStore((state) => state.plan.limits.maxVehicles)
  const openUpgradeModal = useAppStore((state) => state.openUpgradeModal)

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return // User cancelled, do nothing

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size
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
      // Simulate file input change event
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

    // Check plan limit
    if (currentVehicleCount >= maxVehicles) {
      openUpgradeModal({ limitName: 'maxVehicles' })
      return
    }

    setLoading(true)
    // Simulate API call – in real app you'd upload the image and get a URL
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const vehicleData = {
      model,
      plateNumber,
      type,
      imageUrl: imagePreview || undefined,
    }

    toast.success(`Vehicle ${plateNumber} added successfully`)
    setOpen(false)
    // Reset form
    setModel('')
    setPlateNumber('')
    setType('VAN')
    handleRemoveImage()
    onVehicleAdded?.(vehicleData)
    setLoading(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm" leftIcon={<Truck size={14} />}>
            Add Vehicle
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg py-6 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Add a new vehicle</SheetTitle>
          <SheetDescription>Enter vehicle details.</SheetDescription>
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
              inputMode="text"
              type="text"
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>

          {/* Plate Number */}
          <div className="space-y-2">
            <Label htmlFor="plateNumber" required>
              Plate Number
            </Label>
            <Input
              id="plateNumber"
              placeholder="e.g. AS-1234-23"
              inputMode="text"
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
              required
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
              Add Vehicle
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
