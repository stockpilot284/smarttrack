import { Skeleton } from '@/components/ui/skeleton'

interface TableSkeletonProps {
  showToolbar?: boolean
  showPagination?: boolean
}

export default function TableSkeleton({
  showToolbar = true,
  showPagination = true,
}: TableSkeletonProps) {
  return (
    <div className="flex flex-col gap-6 mt-12 bg-background px-4 py-8 md:p-8 rounded-md shadow-xs">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex gap-2 justify-end">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      )}

      {/* Main Card Placeholder */}
      <Skeleton className="h-80" />

      {/* Pagination */}
      {showPagination && (
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40 rounded-md" />

          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      )}
    </div>
  )
}
