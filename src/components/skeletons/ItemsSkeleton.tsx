// components/skeletons/ItemsSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ItemsSkeleton() {
  return (
    <Card className="flex flex-col gap-6 px-6 py-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      <CardContent className="p-0 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-3 bg-muted/30 p-4 rounded-md"
          >
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
