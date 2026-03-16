// components/billing/BillingHistory.tsx
import { Link, useParams } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Download } from 'lucide-react'
import { Badge } from '../ui/badge'
import { ScrollableWithFade } from '../ScrollableWithFade'

export function BillingHistory() {
  const { companyId } = useParams({ from: '/apps/$companyId/billing/' })
  // Mock data – replace with real
  const invoices = [
    {
      id: 'inv_1',
      date: '2026-03-01',
      amount: 29.0,
      status: 'Paid',
      pdf: '#',
      plan: 'GROWTH',
    },
    {
      id: 'inv_2',
      date: '2026-02-01',
      amount: 29.0,
      status: 'Paid',
      pdf: '#',
      plan: 'GROWTH',
    },
    {
      id: 'inv_3',
      date: '2026-01-01',
      amount: 29.0,
      status: 'Paid',
      pdf: '#',
      plan: 'GROWTH',
    },
    {
      id: 'inv_4',
      date: '2025-12-01',
      amount: 29.0,
      status: 'Paid',
      pdf: '#',
      plan: 'GROWTH',
    },
    {
      id: 'inv_5',
      date: '2025-11-01',
      amount: 29.0,
      status: 'Paid',
      pdf: '#',
      plan: 'GROWTH',
    },
    {
      id: 'inv_5',
      date: '2025-11-01',
      amount: 29.0,
      status: 'Paid',
      pdf: '#',
      plan: 'GROWTH',
    },
    {
      id: 'inv_5',
      date: '2025-11-01',
      amount: 29.0,
      status: 'Paid',
      pdf: '#',
      plan: 'GROWTH',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollableWithFade heightClass="h-64">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="text-[13px]">
                  <TableCell>
                    {new Date(inv.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${inv.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {inv.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs bg-green-50/70 text-green-800 dark:bg-green-500/20 dark:text-green-300 px-2 py-1 rounded-md">
                      {inv.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="iconMd" asChild>
                      <a href={inv.pdf} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollableWithFade>
        <div className="text-center">
          <Button variant="link" size="md">
            <Link to="/apps/$companyId/billing/history" params={{ companyId }}>
              View all invoices
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
