import OrdersTable from '../OrdersTable'
import { mockRecentOrders } from '@/data/orders'

export default function Orders() {
  return (
    <section className="mt-12 bg-background px-4 py-8 md:p-8 rounded-md shadow-xs">
      <OrdersTable
        data={mockRecentOrders}
        enableActionsColumn
        enableRowSelection
        enableSearchAndFilter
        enablePagination
      />
    </section>
  )
}
