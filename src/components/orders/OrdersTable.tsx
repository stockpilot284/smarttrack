import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  FilterFn,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import {
  MoreVertical,
  Trash2,
  Filter,
  Package,
  SlidersHorizontalIcon,
  ArrowUpDownIcon,
  ArrowLeft,
  ArrowRightIcon,
  UploadCloudIcon,
  Eye,
  MapPin,
  X,
  RotateCcw,
  CheckSquare,
  Calendar,
  User,
  Truck,
  ListFilter,
} from 'lucide-react'

import { StatusBadge } from '@/components/StatusBadge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/EmptyState'
import {
  motion,
  AnimatePresence,
  easeInOut,
  easeOut,
  easeIn,
} from 'framer-motion'
import {
  OrdersTableProps,
  OrderStatus,
  OrderStatuses,
  OrderTable,
} from '@/types/order.type'
import { Link, useParams } from '@tanstack/react-router'
import { Avatar, AvatarFallback } from '../ui/avatar'
import DeleteOrder from './DeleteOrder'
import RestoreOrder from './RestoreOrder'
import PermanentDeleteOrder from './PermantelyDeleteOrder'
import { useAppStore } from '@/lib/store/zustand'
import { format } from 'date-fns'
import MarkAsCompleted from './MarkAsCompleted'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type Filters = {
  statuses: OrderStatus[]
  driver: string
  vehicle: string
  startDate: string
  endDate: string
}

const EMPTY_FILTERS: Filters = {
  statuses: [],
  driver: '',
  vehicle: '',
  startDate: '',
  endDate: '',
}

// ─── Status pill config ───────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  CREATED: {
    label: 'Created',
    className:
      'bg-purple-50/70 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
  },
  ASSIGNED: {
    label: 'Assigned',
    className:
      'bg-indigo-50/70 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
  },

  IN_TRANSIT: {
    label: 'In Transit',
    className:
      'bg-blue-50/70 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  },
  DELIVERED: {
    label: 'Delivered',
    className:
      'bg-emerald-50/70 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  FAILED: {
    label: 'Failed',
    className: 'bg-red-50/70 text-red-800 dark:bg-red-500/20 dark:text-red-300',
  },
  CANCELLED: {
    label: 'Cancelled',
    className:
      'bg-slate-50/70 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
  },
  DELETED: {
    label: 'Deleted',
    className:
      'bg-gray-50/70 text-gray-500 dark:bg-gray-500/20 dark:text-gray-300',
  },
}

// ─── Filter sheet ─────────────────────────────────────────────────────────────

function FilterSheet({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onApply,
  onReset,
  activeCount,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  draft: Filters
  onDraftChange: (f: Filters) => void
  onApply: () => void
  onReset: () => void
  activeCount: number
}) {
  const toggleStatus = (status: OrderStatus) => {
    onDraftChange({
      ...draft,
      statuses: draft.statuses.includes(status)
        ? draft.statuses.filter((s) => s !== status)
        : [...draft.statuses, status],
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <ListFilter className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-sm font-medium leading-tight">
                  Filter Orders
                </SheetTitle>
                {activeCount > 0 && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {activeCount} filter{activeCount > 1 ? 's' : ''} active
                  </p>
                )}
              </div>
            </div>
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Reset all
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Status section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </span>
              {draft.statuses.length > 0 && (
                <Badge
                  variant="secondary"
                  className="h-4 px-1.5 text-[10px] ml-auto"
                >
                  {draft.statuses.length}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {OrderStatuses.map((status) => {
                const config = STATUS_CONFIG[status]
                const isSelected = draft.statuses.includes(status)
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all duration-150',
                      isSelected
                        ? config.className + ' ring-1 ring-current/20'
                        : 'border-border/40 text-muted-foreground hover:border-border hover:bg-accent/50',
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full shrink-0',
                        isSelected ? 'bg-current' : 'bg-muted-foreground/40',
                      )}
                    />
                    {config.label}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-border/40" />

          {/* Assignment section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Assignment
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Driver name"
                  size="sm"
                  value={draft.driver}
                  onChange={(e) =>
                    onDraftChange({ ...draft, driver: e.target.value })
                  }
                  className="pl-8 text-xs"
                />
                {draft.driver && (
                  <button
                    onClick={() => onDraftChange({ ...draft, driver: '' })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Vehicle"
                  size="sm"
                  value={draft.vehicle}
                  onChange={(e) =>
                    onDraftChange({ ...draft, vehicle: e.target.value })
                  }
                  className="pl-8 text-xs"
                />
                {draft.vehicle && (
                  <button
                    onClick={() => onDraftChange({ ...draft, vehicle: '' })}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-border/40" />

          {/* Date range section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date range
              </span>
              {(draft.startDate || draft.endDate) && (
                <button
                  onClick={() =>
                    onDraftChange({ ...draft, startDate: '', endDate: '' })
                  }
                  className="ml-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">From</p>
                <Input
                  size="sm"
                  type="date"
                  value={draft.startDate}
                  onChange={(e) =>
                    onDraftChange({ ...draft, startDate: e.target.value })
                  }
                  className="text-xs"
                />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">To</p>
                <Input
                  size="sm"
                  type="date"
                  value={draft.endDate}
                  onChange={(e) =>
                    onDraftChange({ ...draft, endDate: e.target.value })
                  }
                  className="text-xs"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <SheetFooter className="px-5 py-4 border-t border-border/50 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={onApply}>
            Apply filters
            {draft.statuses.length +
              (draft.driver ? 1 : 0) +
              (draft.vehicle ? 1 : 0) +
              (draft.startDate || draft.endDate ? 1 : 0) >
              0 && (
              <Badge
                variant="secondary"
                className="ml-1.5 h-4 px-1.5 text-[10px] bg-primary-foreground/20 text-primary-foreground"
              >
                {draft.statuses.length +
                  (draft.driver ? 1 : 0) +
                  (draft.vehicle ? 1 : 0) +
                  (draft.startDate || draft.endDate ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrdersTable({
  data,
  enableSearchAndFilter = false,
  enableRowSelection = false,
  enableActionsColumn = false,
  enablePagination = false,
}: OrdersTableProps) {
  const [tableData] = useState<OrderTable[]>(data)
  const [searchInput, setSearchInput] = useState('')
  const [globalSearch, setGlobalSearch] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)
  const [deleteReason, setDeleteReason] = useState('')
  const { softDeleteOrders, allowManualOrderCompletion } = useAppStore(
    (state) => state.settings.orderSettings,
  )

  const { companyId } = useParams({ from: '/apps/$companyId' })

  useEffect(() => {
    const t = setTimeout(() => {
      setGlobalSearch(searchInput)
      setPageIndex(0)
    }, 1000)
    return () => clearTimeout(t)
  }, [searchInput])

  const handleDeleteSelected = () => {
    if (!deleteReason.trim()) return
    const payload = { ids: Array.from(selectedRows), reason: deleteReason }
    console.log('Deleting:', payload)
    setDeleteReason('')
    setSelectedRows(new Set())
  }

  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [draftFilters, setDraftFilters] = useState<Filters>(EMPTY_FILTERS)

  const activeFilterCount =
    filters.statuses.length +
    (filters.driver ? 1 : 0) +
    (filters.vehicle ? 1 : 0) +
    (filters.startDate || filters.endDate ? 1 : 0)

  const handleOpenFilterSheet = () => {
    setDraftFilters(filters)
    setFilterSheetOpen(true)
  }

  const handleApplyFilters = () => {
    setFilters(draftFilters)
    setPageIndex(0)
    setFilterSheetOpen(false)
  }

  const handleResetFilters = () => {
    setDraftFilters(EMPTY_FILTERS)
    setFilters(EMPTY_FILTERS)
  }

  // ── Filter functions ───────────────────────────────────────────────────────

  const filterFns: Record<string, FilterFn<OrderTable>> = {
    includesText: (row, columnId, value) =>
      String(row.getValue(columnId))
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  }

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<OrderTable>[]>(() => {
    const cols: ColumnDef<OrderTable>[] = []

    if (enableRowSelection) {
      cols.push({
        id: 'select',
        header: () => (
          <Checkbox
            size="sm"
            checked={
              selectedRows.size > 0 && selectedRows.size === tableData.length
            }
            onCheckedChange={(checked) =>
              setSelectedRows(
                checked ? new Set(tableData.map((d) => d.orderRef)) : new Set(),
              )
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            size="sm"
            checked={selectedRows.has(row.original.orderRef)}
            onCheckedChange={(checked) => {
              const next = new Set(selectedRows)
              checked
                ? next.add(row.original.orderRef)
                : next.delete(row.original.orderRef)
              setSelectedRows(next)
            }}
          />
        ),
      })
    }

    cols.push(
      { header: 'Order Ref', accessorKey: 'orderRef' },
      { header: 'Customer', accessorKey: 'customer' },
      {
        header: 'Assigned Driver',
        accessorKey: 'driver',
        cell: (info) => {
          const driver = info.getValue() as string | null
          return driver ?? 'Unassigned'
        },
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: (info) => {
          const date = new Date(info.getValue() as string)
          return format(date, 'MMM dd, yyyy')
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => (
          <StatusBadge
            status={info.getValue() as OrderStatus}
            variant="order"
          />
        ),
      },
      {
        header: 'Assigned Vehicle',
        accessorKey: 'vehicle',
        cell: (info) => {
          const vehicle = info.getValue() as string | null
          return vehicle ?? 'Unassigned'
        },
      },
      {
        header: 'Pickup Address',
        accessorKey: 'pickupLocation',
        cell: (info) => {
          const location = info.getValue() as string
          return location ? (
            <span className="text-foreground truncate">{location}</span>
          ) : (
            <span>N/A</span>
          )
        },
      },
      {
        header: 'Drop-off Address',
        accessorKey: 'dropOffLocation',
        cell: (info) => {
          const location = info.getValue() as string
          return location ? (
            <span className="text-foreground truncate">{location}</span>
          ) : (
            <span>N/A</span>
          )
        },
      },
    )

    if (enableActionsColumn) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const order = info.row.original
          const orderRef = order.orderRef

          const isCreated = order.status === 'CREATED'
          const isAssigned = order.status === 'ASSIGNED'
          const isInTransit = order.status === 'IN_TRANSIT'
          const isDeleted = order.status === 'DELETED'

          const showSoftDelete = softDeleteOrders && isCreated
          const showRestore = softDeleteOrders && isDeleted
          const showPermanentDelete = softDeleteOrders && isDeleted
          const showManualComplete =
            allowManualOrderCompletion && (isAssigned || isInTransit)

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={12} className="text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit shadow border border-border/30 rounded-sm flex flex-col p-1.5">
                <Link
                  className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer"
                  to="/apps/$companyId/orders/$orderRef"
                  params={{ companyId, orderRef }}
                >
                  <Eye size={14} />
                  <span>View</span>
                </Link>
                {showManualComplete && (
                  <MarkAsCompleted orderReference={orderRef} />
                )}
                {showSoftDelete && <DeleteOrder orderReference={orderRef} />}
                {showRestore && <RestoreOrder orderReference={orderRef} />}
                {showPermanentDelete && (
                  <PermanentDeleteOrder orderReference={orderRef} />
                )}
              </PopoverContent>
            </Popover>
          )
        },
      })
    }

    return cols
  }, [enableRowSelection, enableActionsColumn, selectedRows, tableData])

  // ── Table ──────────────────────────────────────────────────────────────────

  const table = useReactTable({
    data: tableData,
    columns,
    filterFns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
  })

  const filteredRows = useMemo(() => {
    return table.getRowModel().rows.filter((row) => {
      const o = row.original

      if (globalSearch) {
        const match = ['orderRef', 'customer', 'driver'].some((key) =>
          String(o[key as keyof OrderTable])
            .toLowerCase()
            .includes(globalSearch.toLowerCase()),
        )
        if (!match) return false
      }

      if (filters.statuses.length && !filters.statuses.includes(o.status))
        return false
      if (
        filters.driver &&
        !o?.driver?.toLowerCase().includes(filters.driver.toLowerCase())
      )
        return false
      if (
        filters.vehicle &&
        !o?.vehicle?.toLowerCase().includes(filters.vehicle.toLowerCase())
      )
        return false
      if (
        filters.startDate &&
        new Date(o.createdAt) < new Date(filters.startDate)
      )
        return false
      if (filters.endDate && new Date(o.createdAt) > new Date(filters.endDate))
        return false

      return true
    })
  }, [table, globalSearch, filters])

  const paginatedRows = enablePagination
    ? filteredRows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
    : filteredRows

  const totalRows = filteredRows.length
  const totalPages = Math.ceil(totalRows / pageSize)
  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex >= totalPages - 1
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows)

  // ── Animation ──────────────────────────────────────────────────────────────

  const animationKey = `${pageIndex}-${globalSearch}-${JSON.stringify(filters)}`
  const rowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: easeInOut },
    },
    exit: { opacity: 0, y: 8, transition: { duration: 0.12, ease: easeIn } },
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Toolbar */}
      {enableSearchAndFilter && (
        <div className="flex flex-row gap-2 w-full justify-start md:justify-end">
          {selectedRows.size > 0 ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                className="flex items-center gap-3 md:gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: easeOut }}
                exit={{ opacity: 0 }}
              >
                <Button
                  variant="outline"
                  leftIcon={<UploadCloudIcon size={16} />}
                  size="sm"
                  className="text-xs"
                >
                  Export ({selectedRows.size})
                </Button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <Input
                type="search"
                placeholder="Search orders..."
                value={searchInput}
                size="sm"
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border-border/50 dark:border-border"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-xs relative"
                onClick={handleOpenFilterSheet}
                leftIcon={<SlidersHorizontalIcon size={14} />}
              >
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-1.5 overflow-hidden"
          >
            {filters.statuses.map((s) => (
              <span
                key={s}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]',
                  STATUS_CONFIG[s].className,
                )}
              >
                {STATUS_CONFIG[s].label}
                <button
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      statuses: f.statuses.filter((st) => st !== s),
                    }))
                  }
                  className="hover:opacity-70"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            {filters.driver && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                Driver: {filters.driver}
                <button
                  onClick={() => setFilters((f) => ({ ...f, driver: '' }))}
                  className="hover:opacity-70"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
            {filters.vehicle && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                Vehicle: {filters.vehicle}
                <button
                  onClick={() => setFilters((f) => ({ ...f, vehicle: '' }))}
                  className="hover:opacity-70"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
            {(filters.startDate || filters.endDate) && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {filters.startDate && filters.endDate
                  ? `${filters.startDate} → ${filters.endDate}`
                  : filters.startDate
                    ? `From ${filters.startDate}`
                    : `Until ${filters.endDate}`}
                <button
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      startDate: '',
                      endDate: '',
                    }))
                  }
                  className="hover:opacity-70"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors ml-1"
            >
              <RotateCcw className="h-3 w-3" />
              Clear all
            </button>
          </motion.div>
        </AnimatePresence>
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
                    colSpan={table.getAllLeafColumns().length}
                    className="p-4"
                  >
                    <EmptyState
                      title="No orders found"
                      description="There are no orders to display. New orders will appear here, or try adjusting your search and filters."
                      Icon={Package}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enablePagination && (
          <div className="flex items-center justify-between">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${startRow}-${endRow}-${totalRows}`}
                variants={{
                  ...rowVariants,
                  visible: {
                    ...rowVariants.visible,
                    transition: {
                      ...rowVariants.visible.transition,
                      duration: 0.3,
                      delay: 0.3,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
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
                variants={{
                  ...rowVariants,
                  visible: {
                    ...rowVariants.visible,
                    transition: {
                      ...rowVariants.visible.transition,
                      duration: 0.3,
                      delay: 0.3,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFirstPage}
                  onClick={() => setPageIndex((p) => Math.max(p - 1, 0))}
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
                    setPageIndex((p) => Math.min(p + 1, totalPages - 1))
                  }
                >
                  <ArrowRightIcon size={14} />
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Filter sheet */}
      <FilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        draft={draftFilters}
        onDraftChange={setDraftFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        activeCount={activeFilterCount}
      />
    </div>
  )
}
