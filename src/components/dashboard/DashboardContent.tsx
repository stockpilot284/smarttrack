import { TodayDate } from '../TodayDate'
import Alerts from './Alerts'
import DeliveryPerformance from './DeliveryPerformance'
import { FleetStatusWidget } from './FleetsStatusWidget'
import Greeting from './Greeting'
import KpiOverview from './KpiOverview'
import RecentOrders from './RecentOrders'

export default function DashboardContent() {
  const fleetCounts = {
    available: 5,
    onRoute: 12,
    maintenance: 2,
    total: 19,
  }
  return (
    <div className="flex flex-col gap-8 p-6">
      {/** Greeting & Today's Date */}
      <section className="flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between md:items-center">
        <Greeting />
        <TodayDate />
      </section>

      {/** KPI's */}
      <KpiOverview />

      {/** Alerts  & Delivery Performance */}
      <section className="grid grid-cols-1  lg:grid-cols-2 lg:grid-rows-1 gap-4">
        <FleetStatusWidget counts={fleetCounts} />
        <DeliveryPerformance />
      </section>

      {/** Recent Orders */}
      <RecentOrders />
    </div>
  )
}
