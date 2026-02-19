import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CTASkeleton() {
  return (
    <Card className="sticky bottom-0 w-full border-t bg-background/70 backdrop-blur-sm">
      <CardContent className="flex justify-end gap-2 py-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-32" />
      </CardContent>
    </Card>
  )
}
