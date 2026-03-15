import { dashboardKpis } from '@/data/dashboard-kpis'
import { TodayDate } from './TodayDate'
import DeliveryPerformance from './DeliveryPerformance'
import Greeting from './Greeting'
import DashboardKpiOverview from './DashboardKpiOverview'
import RecentOrders from './RecentOrders'
import { UpcomingDeliveries } from './UpcomingDeliveries'

export default function DashboardContent() {
  return (
    <div className=" flex flex-col gap-8 p-6">
      {/** Greeting & Today's Date */}
      <section className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
        <Greeting />
        <TodayDate />
      </section>

      {/** KPI's */}
      <DashboardKpiOverview kpis={dashboardKpis} />

      {/** Delivery Performance */}
      <section className="grid grid-cols-1  xl:grid-cols-2 lg:grid-rows-1 gap-4">
        <UpcomingDeliveries />
        <DeliveryPerformance />
      </section>

      {/** Recent Orders */}
      <RecentOrders />
    </div>
  )
}
