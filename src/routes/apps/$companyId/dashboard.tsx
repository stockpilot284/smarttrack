import AlertsWindow from '@/components/dashboard/AlertsWindow'
import DeliveryPerformance from '@/components/dashboard/DeliveryPerformance'
import Greeting from '@/components/dashboard/Greeting'
import KpiOverview from '@/components/dashboard/KpiOverview'
import { TodayDate } from '@/components/TodayDate'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/apps/$companyId/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <div className="flex flex-col gap-8">
      {/** Greeting & Today's Date */}
      <section className="flex justify-between items-center">
        <Greeting />
        <TodayDate />
      </section>

      {/** KPI's */}
      <KpiOverview />

      {/** Alerts Window & Delivery Performance */}
      <section className="flex items-center gap-6">
        <AlertsWindow />
        <DeliveryPerformance />
      </section>
    </div>
  )
}
