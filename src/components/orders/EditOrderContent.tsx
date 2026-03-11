// routes/apps/$companyId/orders/edit.tsx
import { orders } from '@/data/orders'
import {
  DeliveryTiming,
  Order,
  OrderItem,
  OrderStatus,
} from '@/types/order.type'
import { useNavigate, useParams } from '@tanstack/react-router'
import React, { ChangeEvent, useState } from 'react'
import StatePlaceholder from '../StatePlaceholder'
import { PackageSearch } from 'lucide-react'
import PageHeader from '../PageHeader'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { useAppStore } from '@/lib/zustand/zustand'

// Import section components
import { OrderDetailsSection } from '@/components/orders/OrderDetailsSection'
import { PickupDetailsSection } from '@/components/orders/PickupDetailsSection'
import { DropoffDetailsSection } from '@/components/orders/DropoffDetailsSecton'
import { NotesSection } from '@/components/orders/NotesSection'
import { ScheduleDeliverySection } from '@/components/orders/ScheduleDeliverySection'
import { ItemsSection } from '@/components/orders/ItemsSection'
import { FormActions } from '@/components/orders/FormActions'

type EditOrderContentProps = {
  params: {
    companyId: string
    orderRef: string
  }
}

export default function EditOrderContent({ params }: EditOrderContentProps) {
  const { orderRef, companyId } = params
  const order = orders.find((o) => o.orderReference === orderRef) as Order
  const navigate = useNavigate()

  const [form, setForm] = useState<Order>(order)
  const [draftItem, setDraftItem] = useState<OrderItem>({
    name: '',
    quantity: 1,
    description: '',
  })
  const [isDirty, setIsDirty] = useState(false)

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

  // Determine editability based on status and settings
  const status = form.status as OrderStatus
  const isCreated = status === 'CREATED'
  const isAssigned = status === 'ASSIGNED'

  // Items can be edited in CREATED, and also in ASSIGNED if setting allows
  const isItemsEditable = isCreated

  // Assignment (driver) can only be edited in CREATED (typical)
  const isAssignmentEditable = isCreated

  const markDirty = () => {
    if (!isDirty) setIsDirty(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Updated Order:', form)
    setIsDirty(false)
    // API call here
  }

  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDraftItem((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, Number(value)) : value,
    }))
    markDirty()
  }

  const addItem = () => {
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

  const removeItem = (name: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.name !== name),
    }))
    markDirty()
  }

  const updateItem = (
    name: string,
    field: keyof OrderItem,
    value: string | number,
  ) => {
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    let parsedValue: any = value
    if (type === 'number') parsedValue = value === '' ? '' : Number(value)
    setForm((prev) => ({ ...prev, [name]: parsedValue }))
    markDirty()
  }

  // Field-level disabled function
  const isFieldDisabled = (fieldName: string) => {
    const status = form.status as OrderStatus

    // Fields that are only editable in CREATED
    const createdOnlyFields = [
      'customerEmail',
      'priority',
      'customerPhone',
      'packageWeight',
      'pickupContactName',
      'pickupContactPhone',
      'recipientName',
      'deliveryTiming',
      'recipientPhone',
      'pickupLocation',
      'dropoffLocation',
    ]

    if (createdOnlyFields.includes(fieldName)) {
      return !isCreated
    }

    if (fieldName === 'customerName') {
      return !(isCreated || isAssigned)
    }

    if (fieldName === 'assignedDriver') {
      return !isAssignmentEditable
    }

    if (fieldName === 'items') {
      return !isItemsEditable
    }

    return false
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <PageHeader title="Edit Order" description="Update order information" />

      <div className="flex flex-col gap-8 w-full flex-1">
        <motion.div {...motionPresets.inViewFadeUp}>
          <OrderDetailsSection
            form={form}
            onChange={handleInputChange}
            setForm={setForm}
            errors={{}}
            disabled={isFieldDisabled}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <PickupDetailsSection
            form={form}
            setField={(field: any, value: string) => {
              setForm((prev) => ({ ...prev, [field]: value }))
              markDirty()
            }}
            onChange={handleInputChange}
            errors={{}}
            disabled={isFieldDisabled}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <DropoffDetailsSection
            form={form}
            setField={(field: any, value: string) => {
              setForm((prev) => ({ ...prev, [field]: value }))
              markDirty()
            }}
            onChange={handleInputChange}
            errors={{}}
            disabled={isFieldDisabled}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <NotesSection
            form={form}
            setField={(field: string, value: string) => {
              setForm((prev) => ({ ...prev, [field]: value }))
              markDirty()
            }}
            onChange={handleInputChange}
            errors={{}}
            disabled={isFieldDisabled}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <ScheduleDeliverySection
            form={form}
            setField={(field: string, value: string) => {
              setForm((prev) => ({ ...prev, [field]: value }))
              markDirty()
            }}
            errors={{}}
            disabled={isFieldDisabled}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <ItemsSection
            draftItem={draftItem}
            onDraftChange={handleDraftChange}
            onAdd={addItem}
            items={form.items}
            onUpdate={updateItem}
            onRemove={removeItem}
            errors={{}}
            disabled={!isItemsEditable} // whole section disabled if not editable
          />
        </motion.div>

        <FormActions
          onCancel={() => setForm(order)}
          onSubmit={handleSubmit}
          isDisabled={!isDirty}
          type="EDIT"
        />
      </div>
    </div>
  )
}
