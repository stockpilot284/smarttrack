import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { motionPresets } from '@/lib/motion-presets'
import PageHeader from '@/components/PageHeader'
import { useOrderForm } from '@/hooks/use-order-form'
import { OrderDetailsSection } from '@/components/orders/OrderDetailsSection'
import { PickupDetailsSection } from '@/components/orders/PickupDetailsSection'
import { DropoffDetailsSection } from '@/components/orders/DropoffDetailsSecton'
import { NotesSection } from '@/components/orders/NotesSection'
import { ScheduleDeliverySection } from '@/components/orders/ScheduleDeliverySection'
import { ItemsSection } from '@/components/orders/ItemsSection'
import { FormActions } from '@/components/orders/FormActions'
import { AutoAssignStatus } from '@/components/orders/AutoAssignStatus'
import { useAppStore } from '@/lib/store/zustand'

export const Route = createFileRoute('/apps/$companyId/orders/create')({
  component: CreateOrderRoute,
})

function CreateOrderRoute() {
  const {
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
    validate,
  } = useOrderForm()

  const { companyId } = Route.useParams()
  const autoAssignOrder = useAppStore(
    (state) => state.settings.orderSettings.autoAssignOrder,
  )
  const navigate = useNavigate()

  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    validate()
    if (!isFormValid) return

    setIsSubmitting(true)
    try {
      // API call to create order – replace with real endpoint
      const response = await fetch(`/api/companies/${companyId}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error('Failed to create order')
      const data = await response.json()
      const orderId = data.id

      if (autoAssignOrder) {
        // Show auto-assign status and wait
        setSubmittedOrderId(orderId)
      } else {
        // No auto-assign, go straight to dashboard
        navigate({ to: '/apps/$companyId/dashboard', params: { companyId } })
      }
    } catch (error) {
      console.error(error)
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <PageHeader
        title="Create Order"
        description="Add a delivery to start tracking."
      />

      <div className="flex flex-col gap-8 w-full flex-1">
        {/* All the sections (unchanged) */}
        <motion.div {...motionPresets.inViewFadeUp}>
          <OrderDetailsSection
            form={form}
            onChange={handleInputChange}
            setForm={setForm}
            errors={errors}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <PickupDetailsSection
            form={form}
            setField={setField}
            onChange={handleInputChange}
            errors={errors}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <DropoffDetailsSection
            form={form}
            setField={setField}
            onChange={handleInputChange}
            errors={errors}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <NotesSection
            form={form}
            setField={setField}
            onChange={handleInputChange}
            errors={errors}
          />
        </motion.div>

        <motion.div {...motionPresets.inViewFadeUp}>
          <ScheduleDeliverySection
            form={form}
            setField={setField}
            errors={errors}
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
            errors={errors}
          />
        </motion.div>

        <FormActions
          onCancel={resetForm}
          onSubmit={handleSubmit}
          isDisabled={!isFormValid || isSubmitting}
        />
      </div>

      {/* Auto‑assign status overlay */}
      {submittedOrderId && (
        <AutoAssignStatus
          orderId={submittedOrderId}
          companyId={companyId}
          onComplete={() => setSubmittedOrderId(null)}
        />
      )}
    </div>
  )
}
