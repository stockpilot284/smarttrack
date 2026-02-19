import Alerts from '@/components/dashboard/Alerts'
import DeliveryPerformance from '@/components/dashboard/DeliveryPerformance'
import Greeting from '@/components/dashboard/Greeting'
import KpiOverview from '@/components/dashboard/KpiOverview'
import RecentOrders from '@/components/dashboard/RecentOrders'
import { TodayDate } from '@/components/TodayDate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <div className="flex flex-col gap-8 py-6">
      {/** Greeting & Today's Date */}
      <section className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
        <Greeting />
        <TodayDate />
      </section>

      {/** KPI's */}
      <KpiOverview />

      {/** Alerts  & Delivery Performance */}
      <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
        <Alerts />
        <DeliveryPerformance />
      </section>

      {/** Recent Orders */}
      <RecentOrders />
    </div>
  )
}
