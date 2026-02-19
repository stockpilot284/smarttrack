import PageHeader from '@/components/PageHeader'
import { SectionHeader } from '@/components/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectTrigger, SelectContent } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  DeliveryTiming,
  Order,
  OrderItem,
  OrderStatus,
} from '@/types/order.type'
import { createFileRoute } from '@tanstack/react-router'
import {
  File,
  MapPin,
  NotebookPenIcon,
  Package,
  PackageSearch,
  Plus,
  Timer,
  Trash2,
  User,
} from 'lucide-react'
import { ChangeEvent, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { motionPresets } from '@/lib/motion-presets'
import { fields } from '@/data/form-fields'
import LocationPicker from '@/components/orders/LocationPicker'
import { orders } from '@/data/orders'
import EditOrderSkeleton from '@/components/skeletons/EditOrderSkeleton'
import StatePlaceholder from '@/components/StatePlaceholder'

export const Route = createFileRoute('/apps/$companyId/orders/$orderRef/edit')({
  component: EditOrderRoute,
})

type OrderFormErrors = Partial<Record<keyof Order, string>>

function EditOrderRoute() {
  const { orderRef } = Route.useParams()
  const order = orders.find((o) => o.orderReference === orderRef) as Order

  const [form, setForm] = useState<Order>(order)
  const [draftItem, setDraftItem] = useState<OrderItem>({
    name: '',
    quantity: 1,
    description: '',
  })
  const [errors, setErrors] = useState<OrderFormErrors>({})
  const [isDirty, setIsDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { companyId } = Route.useParams()
  const navigate = Route.useNavigate()

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <EditOrderSkeleton />
  }

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center">
        <StatePlaceholder
          title="Order not found"
          description="We couldn’t find the order you’re looking for. It may have been deleted or the link is incorrect."
          buttonLabel="Back to orders"
          icon={PackageSearch}
          onAction={() =>
            navigate({
              to: '/apps/$companyId/orders',
              params: { companyId },
            })
          }
        />
      </div>
    )
  }
  const isFormValid = Object.keys(validateOrder(form)).length === 0

  // Editable conditions
  const editableStatusesForItems = [OrderStatus.CREATED, OrderStatus.ASSIGNED]
  const editableStatusesForAssignment = [OrderStatus.CREATED]
  const isItemsEditable = editableStatusesForItems.includes(
    form.status as OrderStatus,
  )
  const isAssignmentEditable = editableStatusesForAssignment.includes(
    form.status as OrderStatus,
  )

  function markDirty() {
    if (!isDirty) setIsDirty(true)
  }

  function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    const validationErrors = validateOrder(form)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Submit updated order
    console.log('Updated Order:', form)
    setIsDirty(false)
  }

  function validateOrder(form: Order): OrderFormErrors {
    const errors: OrderFormErrors = {}

    if (!form.customerName.trim())
      errors.customerName = 'Customer name is required'
    if (!form.customerEmail.trim())
      errors.customerEmail = 'Customer email is required'
    if (!form.pickupLocation?.address)
      errors.pickupLocation = 'Pickup location is required'
    if (!form.pickupContactName.trim())
      errors.pickupContactName = 'Pickup contact name is required'
    if (!form.pickupContactPhone.trim())
      errors.pickupContactPhone = 'Pickup contact phone is required'
    if (!form.dropoffLocation?.address)
      errors.dropoffLocation = 'Drop-off location is required'
    if (!form.recipientName.trim())
      errors.recipientName = 'Recipient name is required'
    if (!form.recipientPhone.trim())
      errors.recipientPhone = 'Recipient phone is required'
    if (!form.items || form.items.length === 0)
      errors.items = 'At least one item is required'
    if (
      form.deliveryTiming === DeliveryTiming.SCHEDULED &&
      !form.scheduledPickupAt
    ) {
      errors.scheduledPickupAt = 'Scheduled pickup date is required'
    }

    return errors
  }

  function handleDraftChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setDraftItem((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, Number(value)) : value,
    }))
    markDirty()
  }

  function addItem() {
    if (!draftItem.name.trim()) return

    setForm((prev) => {
      const index = prev.items.findIndex(
        (i) => i.name.toLowerCase() === draftItem.name.toLowerCase(),
      )
      if (index !== -1) {
        const updated = [...prev.items]
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + draftItem.quantity,
        }
        return { ...prev, items: updated }
      }
      return {
        ...prev,
        items: [...prev.items, { ...draftItem, name: draftItem.name.trim() }],
      }
    })
    setDraftItem({ name: '', quantity: 1, description: '' })
    markDirty()
  }

  function removeItem(name: string) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.name !== name),
    }))
    markDirty()
  }

  function updateItem(
    name: string,
    field: keyof OrderItem,
    value: string | number,
  ) {
    if (!isItemsEditable) return
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.name === name
          ? {
              ...item,
              [field]:
                field === 'quantity' ? Math.max(1, Number(value)) : value,
            }
          : item,
      ),
    }))
    markDirty()
  }

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target
    let parsedValue: any = value
    if (type === 'number') parsedValue = value === '' ? '' : Number(value)
    setForm((prev) => ({ ...prev, [name]: parsedValue }))
    markDirty()
  }

  function isFieldDisabled(fieldName: string, status: OrderStatus) {
    if (
      [
        'customerEmail',
        'customerPhone',
        'packageWeight',
        'pickupContactName',
        'pickupContactPhone',
        'recipientName',
        'recipientPhone',
        'pickupLocation',
        'dropoffLocation',
      ].includes(fieldName)
    ) {
      return status !== OrderStatus.CREATED
    }

    if (fieldName === 'customerName') {
      return ![OrderStatus.CREATED, OrderStatus.ASSIGNED].includes(status)
    }

    return false
  }

  return (
    <div className="flex flex-col gap-8 py-6">
      <PageHeader title="Edit Order" description="Update order information" />

      <form
        className="flex flex-col gap-8 w-full flex-1"
        onSubmit={handleSubmit}
      >
        {/** Order Details */}
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card className="flex flex-col gap-8 px-6">
            <SectionHeader
              title="Order Details"
              iconColor="text-foreground"
              icon={File}
            />
            <CardContent className="p-0">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.orderDetails.map((field) => (
                  <li
                    key={field.name}
                    className="flex flex-col gap-2 w-full last:col-span-full"
                  >
                    <Label required={field.required}>{field.label}</Label>
                    <Input
                      size="md"
                      name={field.name}
                      value={form[field.name]}
                      placeholder={field.placeholder}
                      onChange={handleOnChange}
                      required={field.required}
                      disabled={isFieldDisabled(
                        field.name,
                        form.status as OrderStatus,
                      )}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/** Pickup Details */}
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card className="flex flex-col gap-8 px-6">
            <SectionHeader
              title="Pickup Details"
              iconColor="text-foreground"
              icon={MapPin}
            />
            <CardContent className="p-0">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocationPicker
                  disabled={isFieldDisabled(
                    'pickupLocation',
                    form.status as OrderStatus,
                  )}
                  value={form.pickupLocation}
                  label="Pickup Location"
                  placeholder="Select pickup location"
                  required
                  onChange={(location) => {
                    setForm((prev) => ({ ...prev, pickupLocation: location }))
                    markDirty()
                  }}
                />
                {fields.pickupDetails.map((field) => (
                  <li
                    key={field.name}
                    className="flex flex-col gap-2 w-full last:col-span-full"
                  >
                    <Label required={field.required}>{field.label}</Label>
                    <Input
                      size="md"
                      name={field.name}
                      value={form[field.name]}
                      placeholder={field.placeholder}
                      onChange={handleOnChange}
                      required={field.required}
                      disabled={isFieldDisabled(
                        field.name,
                        form.status as OrderStatus,
                      )}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/** Drop-off Details */}
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card className="flex flex-col gap-8 px-6">
            <SectionHeader
              title="Drop-off Details"
              iconColor="text-foreground"
              icon={MapPin}
            />
            <CardContent className="p-0">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocationPicker
                  disabled={isFieldDisabled(
                    'dropoffLocation',
                    form.status as OrderStatus,
                  )}
                  value={form.dropoffLocation}
                  label="Drop-off Location"
                  placeholder="Select drop-off location"
                  required
                  onChange={(location) => {
                    setForm((prev) => ({ ...prev, dropoffLocation: location }))
                    markDirty()
                  }}
                />
                {fields.dropoffDetails.map((field) => (
                  <li
                    key={field.name}
                    className="flex flex-col gap-2 w-full last:col-span-full"
                  >
                    <Label required={field.required}>{field.label}</Label>
                    <Input
                      size="md"
                      name={field.name}
                      value={form[field.name]}
                      placeholder={field.placeholder}
                      onChange={handleOnChange}
                      required={field.required}
                      disabled={isFieldDisabled(
                        field.name,
                        form.status as OrderStatus,
                      )}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/** Assignment */}
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card className="flex flex-col gap-8 px-6">
            <SectionHeader
              title="Assignment"
              iconColor="text-foreground"
              icon={User}
            />
            <CardContent className="p-0">
              <ul className="flex flex-col md:flex-row md:items-center gap-4">
                {fields.assignment.map((field) => (
                  <li key={field.name} className="flex flex-col gap-2 w-full">
                    <Label required={field.required}>{field.label}</Label>
                    <Select
                      required={field.required}
                      disabled={!isAssignmentEditable}
                      onValueChange={(val) => {
                        if (isAssignmentEditable) {
                          setForm((prev) => ({ ...prev, assignedDriver: val }))
                          markDirty()
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        {field.placeholder}
                      </SelectTrigger>
                      <SelectContent>{/* driver options here */}</SelectContent>
                    </Select>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/** Notes */}
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card className="flex flex-col gap-8 px-6">
            <SectionHeader
              title="Notes"
              iconColor="text-foreground"
              icon={NotebookPenIcon}
            />
            <CardContent className="p-0">
              <ul className="flex flex-col gap-4">
                {fields.notes.map((field) => (
                  <li key={field.name} className="flex flex-col gap-2 w-full">
                    <Label required={field.required}>{field.label}</Label>
                    {field.name === 'deliveryNotes' ? (
                      <Textarea
                        autoComplete="on"
                        value={form.deliveryNotes}
                        placeholder={field.placeholder}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            deliveryNotes: e.target.value,
                          }))
                          markDirty()
                        }}
                        required={field.required}
                      />
                    ) : (
                      <Input
                        size="md"
                        name={field.name}
                        value={form.externalReference}
                        placeholder={field.placeholder}
                        onChange={handleOnChange}
                        required={field.required}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/** Schedule Delivery (Read-only) */}
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card className="flex flex-col gap-8 px-6">
            <SectionHeader
              title="Schedule Delivery"
              iconColor="text-foreground"
              icon={Timer}
            />
            <CardContent className="p-0">
              <div className="flex flex-col gap-2">
                <RadioGroup
                  disabled={form.status !== OrderStatus.CREATED}
                  defaultValue={form.deliveryTiming}
                  onValueChange={(value: DeliveryTiming) =>
                    setForm((prev) => ({
                      ...prev,
                      deliveryTiming: value,
                    }))
                  }
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={DeliveryTiming.SEND_NOW}
                      id={DeliveryTiming.SEND_NOW}
                    />
                    <Label
                      htmlFor={DeliveryTiming.SEND_NOW}
                      className="text-sm"
                    >
                      Send now
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={DeliveryTiming.SCHEDULED}
                      id={DeliveryTiming.SCHEDULED}
                    />
                    <Label
                      htmlFor={DeliveryTiming.SCHEDULED}
                      className="text-sm"
                    >
                      Schedule for later
                    </Label>
                  </div>
                </RadioGroup>

                {form.deliveryTiming === DeliveryTiming.SCHEDULED && (
                  <motion.div
                    className="mt-4 flex flex-col gap-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 24,
                      mass: 0.8,
                    }}
                  >
                    <Label
                      required={
                        form.deliveryTiming === DeliveryTiming.SCHEDULED &&
                        !form.scheduledPickupAt
                      }
                    >
                      Scheduled Pickup Date
                    </Label>
                    <Input
                      required={
                        form.deliveryTiming === DeliveryTiming.SCHEDULED &&
                        !form.scheduledPickupAt
                      }
                      type="date"
                      value={form.scheduledPickupAt}
                      name="scheduledPickupAt"
                      placeholder="Select scheduled date for pickup"
                      onChange={handleOnChange}
                      autoComplete="on"
                    />
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/** Items Section (Editable depending on status) */}
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card className="flex flex-col gap-8 px-6">
            <SectionHeader
              title="Items"
              iconColor="text-foreground"
              icon={Package}
            />
            <CardContent className="p-0">
              {isItemsEditable && (
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="w-full flex flex-col md:flex-row md:items-center gap-2 md:w-220">
                    <div className="w-full flex flex-col gap-2">
                      <Label required>Name</Label>
                      <Input
                        size="sm"
                        type="text"
                        name="name"
                        value={draftItem.name}
                        placeholder="e.g. T-Shirt Polo"
                        onChange={handleDraftChange}
                      />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <Label required>Quantity</Label>
                      <Input
                        size="sm"
                        type="number"
                        min={1}
                        name="quantity"
                        value={draftItem.quantity}
                        onChange={handleDraftChange}
                      />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <Label>Description</Label>
                      <Input
                        size="sm"
                        name="description"
                        value={draftItem.description}
                        onChange={handleDraftChange}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={addItem}
                    disabled={!draftItem.name.trim()}
                    leftIcon={<Plus size={18} />}
                  >
                    Add
                  </Button>
                </div>
              )}

              {form.items.length > 0 && (
                <div className="flex flex-col gap-3 mt-6">
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:justify-between w-full md:items-center gap-6"
                    >
                      <div className="w-full flex flex-col md:flex-row md:w-220 flex items-center gap-2 bg-gray-100/60 p-3 rounded-md">
                        <Input
                          size="sm"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.name, 'name', e.target.value)
                          }
                          readOnly={!isItemsEditable}
                        />
                        <Input
                          size="sm"
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.name, 'quantity', e.target.value)
                          }
                          readOnly={!isItemsEditable}
                        />
                        <Input
                          size="sm"
                          value={item.description ?? ''}
                          onChange={(e) =>
                            updateItem(item.name, 'description', e.target.value)
                          }
                          readOnly={!isItemsEditable}
                        />
                      </div>
                      {isItemsEditable && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.name)}
                          leftIcon={<Trash2 size={18} />}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/** CTA Actions */}
        <Card className="sticky bottom-0 w-full border-t border-primary/10 bg-background/70 backdrop-blur-sm shadow-xs">
          <CardContent className="flex flex-col md:flex-row md:justify-end gap-2 md:px-8">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setForm(order)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              type="submit"
              disabled={!isFormValid || !isDirty}
            >
              Update Order
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
