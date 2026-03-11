import OrdersTable from '@/components/orders/OrdersTable'
import { mockRecentOrders } from '@/data/orders'
import { Card, CardContent } from '../ui/card'

export default function Orders() {
  return (
    <Card className="mt-12 ">
      <CardContent>
        <OrdersTable
          data={mockRecentOrders}
          enableActionsColumn
          enableRowSelection
          enableSearchAndFilter
          enablePagination
        />
      </CardContent>
    </Card>
  )
}
