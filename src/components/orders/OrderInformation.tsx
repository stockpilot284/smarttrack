import { motion } from 'framer-motion'
import { SectionHeader } from '../SectionHeader'
import { motionPresets } from '@/lib/motion-presets'
import { File } from 'lucide-react'
import { format } from 'date-fns'
import { DeliveryTiming, OrderStatus } from '@/types/order.type'
import { InfoHighlight, InfoRow } from './InfoHighlights'
import { OrderInformationSkeleton } from '../skeletons/OrderInformationSkeleton'

interface OrderInformationProps {
  customerName: string
  customerEmail: string
  customerPhone?: string

  orderLabel?: string
  externalReference?: string

  status?: OrderStatus
  deliveryTiming: DeliveryTiming

  packageWeight?: string
  deliveryNotes?: string

  createdAt?: string
  scheduledPickupAt?: string
  estimatedArrival?: string
}

export default function OrderInformation({
  customerName,
  customerEmail,
  customerPhone,
  orderLabel,
  externalReference,
  status,
  deliveryTiming,
  packageWeight,
  deliveryNotes,
  createdAt,
  scheduledPickupAt,
  estimatedArrival,
}: OrderInformationProps) {
  return (
    <motion.div
      className="flex-1 flex flex-col gap-6 p-6 rounded-md bg-card shadow-xs dark:border dark:border-border"
      {...motionPresets.inViewFadeUp}
    >
      <SectionHeader title="Order Information" icon={File} />

      {/* KPI / Meta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InfoHighlight
          label="Status"
          value={status?.replace('_', ' ').toLowerCase() ?? '—'}
        />
        <InfoHighlight
          label="Delivery Type"
          value={deliveryTiming?.replace('_', ' ').toLowerCase()}
        />
        {packageWeight && (
          <InfoHighlight label="Package Weight" value={packageWeight} />
        )}
      </div>

      {/* Information rows */}
      <div className="divide-y divide-gray-200/80 dark:divide-border border border-border/40 dark:border-border rounded-md">
        {orderLabel && <InfoRow label="Order Label" value={orderLabel} />}
        {externalReference && (
          <InfoRow label="External Reference" value={externalReference} />
        )}

        <InfoRow label="Customer Name" value={customerName} />
        <InfoRow label="Customer Email" value={customerEmail} />
        {customerPhone && (
          <InfoRow label="Customer Phone" value={customerPhone} />
        )}

        {createdAt && (
          <InfoRow
            label="Created At"
            value={format(new Date(createdAt), 'MMM dd, hh:mm a')}
          />
        )}

        {scheduledPickupAt && (
          <InfoRow
            label="Scheduled Pickup"
            value={format(new Date(scheduledPickupAt), 'MMM dd, hh:mm a')}
          />
        )}

        {estimatedArrival && (
          <InfoRow
            label="Estimated Arrival"
            value={format(new Date(estimatedArrival), 'MMM dd, hh:mm a')}
          />
        )}

        {deliveryNotes && (
          <InfoRow label="Delivery Notes" value={deliveryNotes} span />
        )}
      </div>
    </motion.div>
  )
}
