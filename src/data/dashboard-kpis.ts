import { DashboardKpiItemProps } from '@/components/dashboard/DashboardKpiOverview'
import { CheckCircle, Clock, Package, Truck } from 'lucide-react'

export const dashboardKpis: DashboardKpiItemProps[] = [
  {
    label: 'Total Orders',
    value: 2_230,
    percentageChange: 13.1,
    Icon: Package,
    styles:
      'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  },
  {
    label: 'Successful Deliveries',
    value: 2_120,
    percentageChange: 8.1,
    Icon: CheckCircle,
    styles:
      'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  },
  {
    label: 'Active Drivers',
    value: 84,
    percentageChange: -3.2,
    Icon: Truck,
    styles: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  },
  {
    label: 'On-time Delivery',
    value: '92%',
    percentageChange: 4.6,
    Icon: Clock,
    styles:
      'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
]
