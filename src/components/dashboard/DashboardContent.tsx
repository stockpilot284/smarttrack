import { TodayDate } from '../TodayDate'
import Alerts from './Alerts'
import DeliveryPerformance from './DeliveryPerformance'
import Greeting from './Greeting'
import KpiOverview from './KpiOverview'
import RecentOrders from './RecentOrders'

export default function DashboardContent() {
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
      <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
        <Alerts />
        <DeliveryPerformance />
      </section>

      {/** Recent Orders */}
      <RecentOrders />
    </div>
  )
}
