import { useParams } from '@tanstack/react-router'
import { Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { BackButton } from '@/components/BackButton'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import { BillingHistoryTable } from './BillingHistoryTable'
import { SectionHeader } from '../SectionHeader'

// Mock data – replace with real data from store/API
const invoices = [
  {
    id: 'INV-2026-001',
    date: '2026-03-01',
    amount: 29.0,
    status: 'Paid',
    pdf: '#',
    plan: 'GROWTH',
  },
  {
    id: 'INV-2026-002',
    date: '2026-02-01',
    amount: 29.0,
    status: 'Paid',
    pdf: '#',
    plan: 'GROWTH',
  },
  {
    id: 'INV-2026-003',
    date: '2026-01-01',
    amount: 29.0,
    status: 'Paid',
    pdf: '#',
    plan: 'GROWTH',
  },
  {
    id: 'INV-2025-012',
    date: '2025-12-01',
    amount: 29.0,
    status: 'Paid',
    pdf: '#',
    plan: 'GROWTH',
  },
  {
    id: 'INV-2025-011',
    date: '2025-11-01',
    amount: 29.0,
    status: 'Paid',
    pdf: '#',
    plan: 'GROWTH',
  },
]

export default function BillingHistoryContent() {
  const { companyId } = useParams({ from: '/apps/$companyId/billing/history/' })

  return (
    <div className="p-6 space-y-6">
      <motion.div
        {...motionPresets.slideUp}
        className="flex items-center gap-4"
      >
        <BackButton
          fallbackTo="/apps/$companyId/billing"
          params={{ companyId }}
        />
        <h1 className="text-2xl">Billing History</h1>
      </motion.div>

      <Card>
        <CardHeader>
          <SectionHeader title="Invoices" icon={Receipt} />
        </CardHeader>
        <CardContent>
          <BillingHistoryTable data={invoices} enableSearch enablePagination />
        </CardContent>
      </Card>
    </div>
  )
}
