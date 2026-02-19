import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

interface OrdersTableSkeletonProps {
  rows?: number
  columns?: number
  showToolbar?: boolean
  showPagination?: boolean
}

export default function OrdersTableSkeleton({
  rows = 6,
  columns = 8,
  showToolbar = true,
  showPagination = true,
}: OrdersTableSkeletonProps) {
  return (
    <div className="flex flex-col gap-6  mt-12 bg-background px-4 py-8 md:p-8 rounded-md shadow-xs">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex gap-2 justify-end">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/40">
        <table className="min-w-full">
          <thead className="bg-muted/40">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton className="h-3 w-20 rounded" />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border/40">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.04 }}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <Skeleton className="h-4 w-full max-w-[160px] rounded-sm" />
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

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
