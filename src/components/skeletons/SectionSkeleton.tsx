// components/skeletons/SectionSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import SectionHeaderSkeleton from './SectionHeaderSkeleton'

interface Props {
  fields?: number
}

export function SectionSkeleton({ fields = 4 }: Props) {
  return (
    <Card className="flex flex-col gap-6 px-6 py-6">
      {/* Header */}
      <SectionHeaderSkeleton />

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: fields }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
