// components/billing/BillingHistoryTable.tsx (updated with Invoice ID)
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpDownIcon,
  ArrowLeft,
  ArrowRightIcon,
  Download,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  motion,
  AnimatePresence,
  easeInOut,
  easeOut,
  easeIn,
} from 'framer-motion'
import { useParams } from '@tanstack/react-router'
import { format } from 'date-fns'

// Define the invoice type (can be moved to a shared types file)
export interface Invoice {
  id: string
  date: string
  amount: number
  plan: string
  status: string
  pdf: string
}

interface BillingHistoryTableProps {
  data: Invoice[]
  enableSearch?: boolean
  enablePagination?: boolean
}

export function BillingHistoryTable({
  data,
  enableSearch = false,
  enablePagination = false,
}: BillingHistoryTableProps) {
  const [tableData] = useState<Invoice[]>(data)
  const [globalSearch, setGlobalSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setGlobalSearch(searchInput)
    }, 1000)
    return () => clearTimeout(handler)
  }, [searchInput])

  // Columns definition
  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        header: 'Invoice ID',
        accessorKey: 'id',
      },
      {
        header: 'Date',
        accessorKey: 'date',
        cell: (info) =>
          format(new Date(info.getValue() as string), 'MMM dd, yyyy'),
      },

      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
      },
      {
        header: 'Plan',
        accessorKey: 'plan',
        cell: (info) => (
          <Badge variant="outline" className="capitalize">
            {info.getValue() as string}
          </Badge>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => {
          const status = info.getValue() as string
          return (
            <span
              className={`text-xs px-2 py-1 rounded-md ${
                status === 'Paid'
                  ? 'bg-green-50/70 text-green-800 dark:bg-green-500/20 dark:text-green-300'
                  : 'bg-yellow-50/70 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300'
              }`}
            >
              {status}
            </span>
          )
        },
      },
      {
        id: 'download',
        header: '',
        cell: (info) => (
          <Button variant="ghost" size="iconMd" asChild>
            <a href={info.row.original.pdf} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
  })

  // Filter rows by global search
  const filteredRows = useMemo(() => {
    if (!globalSearch) return table.getRowModel().rows
    const query = globalSearch.toLowerCase()
    return table.getRowModel().rows.filter((row) => {
      const inv = row.original
      return (
        inv.date.toLowerCase().includes(query) ||
        inv.id.toLowerCase().includes(query) ||
        inv.amount.toString().includes(query) ||
        inv.plan.toLowerCase().includes(query) ||
        inv.status.toLowerCase().includes(query)
      )
    })
  }, [table, globalSearch])

  const paginatedRows = enablePagination
    ? filteredRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
    : filteredRows

  const totalRows = filteredRows.length
  const totalPages = Math.ceil(totalRows / pageSize)
  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex >= totalPages - 1
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  const animationKey = `${pageIndex}-${globalSearch}`
  const rowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: easeInOut },
    },
    exit: { opacity: 0, y: 8, transition: { duration: 0.12, ease: easeIn } },
  }

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Toolbar */}
      {enableSearch && (
        <div className="flex flex-row gap-2 w-full justify-start md:justify-end">
          <Input
            type="search"
            placeholder="Search invoices..."
            value={searchInput}
            size="sm"
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border-border/50"
          />
        </div>
      )}

      <div className="flex flex-col flex-1 justify-between gap-6">
        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full divide-y divide-border/40">
            <thead className="bg-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="py-3 text-[13px] text-muted-foreground text-left px-4 font-normal truncate"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody key={animationKey} className="divide-y divide-border/40">
              <AnimatePresence mode="popLayout">
                {paginatedRows.map((row) => (
                  <motion.tr
                    key={row.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="hover:bg-accent"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-2 text-[13px] truncate"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
              {paginatedRows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enablePagination && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${startRow}-${endRow}-${totalRows}`}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: 0.3 }}
                className="text-xs font-medium flex gap-1.5 border border-border/50 py-1 px-1.5 rounded-md w-fit items-center"
              >
                <span>Showing:</span>
                <span>
                  {startRow}–{endRow}
                </span>
                <span>of</span>
                <span>{totalRows}</span>
                <ArrowUpDownIcon size={12} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="popLayout">
              <motion.div
                className="flex items-center gap-2"
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ delay: 0.3 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFirstPage}
                  onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                >
                  <ArrowLeft size={14} />
                </Button>
                <Button
                  size="sm"
                  className="text-foreground pointer-events-none"
                  variant="outline"
                >
                  {pageIndex + 1}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLastPage}
                  onClick={() =>
                    setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                >
                  <ArrowRightIcon size={14} />
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
