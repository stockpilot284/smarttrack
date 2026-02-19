import { Bell } from 'lucide-react'
import { SectionHeader } from '../SectionHeader'
import { useState } from 'react'
import AlertsWindow, { AlertUI } from './AlertsWindow'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

export default function Alerts() {
  const [alerts] = useState<AlertUI[]>([
    {
      id: '1',
      title: 'Order Delayed',
      description: 'Order #1024 is delayed by 15 minutes.',
      severity: 'critical',
      timestamp: '5 mins ago',
      isRead: false,
      badgeText: 'Order',
      actionLabel: 'View Order',
      href: '/apps/current/orders/1024',
    },
    {
      id: '2',
      title: 'New Driver Added',
      description: 'Driver John Doe has been added to Fleet A.',
      severity: 'info',
      timestamp: '15 mins ago',
      isRead: true,
      badgeText: 'Driver',
    },
    {
      id: '3',
      title: 'System Update',
      description: 'Scheduled maintenance on February 10th, 2026.',
      severity: 'warning',
      timestamp: '1 hour ago',
      isRead: false,
      badgeText: 'System',
    },
    {
      id: '4',
      title: 'All Deliveries Successful',
      description: 'All deliveries completed on time today!',
      severity: 'success',
      timestamp: '2 hours ago',
      isRead: false,
      badgeText: 'Stats',
    },
  ])

  return (
    <motion.div
      className="w-full p-4 bg-background rounded-md h-100 shadow-xs flex flex-col gap-8"
      {...motionPresets.inViewFadeUp}
    >
      {/* Header */}
      <SectionHeader
        title="Alerts"
        icon={Bell}
        actionLabel={alerts.length > 0 ? 'View all' : undefined}
        actionTo={alerts.length > 0 ? '/' : undefined}
      />
      <AlertsWindow alerts={alerts} />
    </motion.div>
  )
}
