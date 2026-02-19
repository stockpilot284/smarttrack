// pages/EditOrderSkeleton.tsx
import PageHeader from '@/components/PageHeader'
import { SectionSkeleton } from '@/components/skeletons/SectionSkeleton'
import { ItemsSkeleton } from '@/components/skeletons/ItemsSkeleton'
import { CTASkeleton } from '@/components/skeletons/CTASkeleton'

export default function EditOrderSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-6">
      <PageHeader title="Edit Order" description="Loading order information…" />
      <SectionSkeleton fields={4} /> {/* Order Details */}
      <SectionSkeleton fields={4} /> {/* Pickup */}
      <SectionSkeleton fields={4} /> {/* Dropoff */}
      <SectionSkeleton fields={2} /> {/* Assignment */}
      <SectionSkeleton fields={2} /> {/* Notes */}
      <SectionSkeleton fields={2} /> {/* Schedule */}
      <ItemsSkeleton />
      {/* <CTASkeleton /> */}
    </div>
  )
}
