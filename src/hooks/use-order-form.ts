// hooks/useOrderForm.ts
import { useState } from 'react'
import { DeliveryTiming, Order, OrderItem } from '@/types/order.type'

const initialOrderForm: Order = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  priority: 'HIGH',
  pickupLocation: { address: '', coordinates: { longitude: 0, latitude: 0 } },
  pickupContactName: '',
  pickupContactPhone: '',
  dropoffLocation: { address: '', coordinates: { longitude: 0, latitude: 0 } },
  recipientName: '',
  recipientPhone: '',
  orderLabel: '',
  packageWeight: '',
  deliveryNotes: '',
  deliveryTiming: 'SEND_NOW',
  scheduledPickupAt: '',
  items: [],
}

type OrderFormErrors = Partial<Record<keyof Order, string>>

export function useOrderForm() {
  const [form, setForm] = useState<Order>(initialOrderForm)
  const [errors, setErrors] = useState<OrderFormErrors>({})
  const [draftItem, setDraftItem] = useState<OrderItem>({
    name: '',
    quantity: 1,
    description: '',
  })

  const validateOrder = (form: Order): OrderFormErrors => {
    const errors: OrderFormErrors = {}

    if (!form.customerName.trim())
      errors.customerName = 'Customer name is required'
    if (!form.customerEmail.trim())
      errors.customerEmail = 'Customer email is required'
    if (!form.customerPhone.trim())
      errors.customerEmail = 'Customer phone is required'
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
    if (form.deliveryTiming === 'SCHEDULED' && !form.scheduledPickupAt) {
      errors.scheduledPickupAt = 'Scheduled pickup date is required'
    }

    return errors
  }

  const isFormValid = Object.keys(validateOrder(form)).length === 0

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDraftItem((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, Number(value)) : value,
    }))
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
  }

  const removeItem = (name: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.name !== name),
    }))
  }

  const updateItem = (
    name: string,
    field: keyof OrderItem,
    value: string | number,
  ) => {
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
  }

  const resetForm = () => {
    setForm(initialOrderForm)
    setErrors({})
    setDraftItem({ name: '', quantity: 1, description: '' })
  }

  const setField = (field: keyof Order, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return {
    form,
    errors,
    draftItem,
    isFormValid,
    handleInputChange,
    handleDraftChange,
    addItem,
    setForm,
    removeItem,
    updateItem,
    resetForm,
    setField,
    validate: () => setErrors(validateOrder(form)),
  }
}
