import OrdersTable from '@/components/orders/OrdersTable'
import { mockRecentOrders } from '@/data/orders'

export default function Orders() {
  return (
    <section className="mt-12 bg-card px-4 py-8 md:p-8 rounded-md shadow-xs flex-1 ">
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
