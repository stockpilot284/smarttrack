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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
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
import { info } from 'console'
import { Avatar, AvatarFallback } from '../ui/avatar'
import DeleteOrder from './DeleteOrder'
import RestoreOrder from './RestoreOrder'
import PermanentDeleteOrder from './PermantelyDeleteOrder'
import { useAppStore } from '@/lib/store/zustand'
import { format } from 'date-fns'
import MarkAsCompleted from './MarkAsCompleted'

// -----------------------
// 3️⃣ Component
// -----------------------
export default function OrdersTable({
  data,
  enableSearchAndFilter = false,
  enableRowSelection = false,
  enableActionsColumn = false,
  enablePagination = false,
}: OrdersTableProps) {
  // -----------------------
  // State
  // -----------------------
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

  const { companyId } = useParams({
    from: '/apps/$companyId',
  })

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setGlobalSearch(searchInput)
      setPageIndex(0)
    }, 1000)

    return () => clearTimeout(delayDebounce)
  }, [searchInput])

  const handleDeleteSelected = () => {
    if (!deleteReason.trim()) return

    // Example payload
    const payload = {
      ids: Array.from(selectedRows),
      reason: deleteReason,
    }

    console.log('Deleting:', payload)

    // TODO:
    // - call API
    // - clear selection
    // - close dialog
    // - show toast

    setDeleteReason('')
    setSelectedRows(new Set())
  }

  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  // ✅ Applied filters (used by table)
  const [filters, setFilters] = useState({
    statuses: [] as OrderStatus[],
    driver: '',
    vehicle: '',
    startDate: '',
    endDate: '',
  })

  // ✅ Draft filters (used inside dialog only)
  const [draftFilters, setDraftFilters] = useState(filters)

  // -----------------------
  // Filter functions
  // -----------------------
  const filterFns: Record<string, FilterFn<OrderTable>> = {
    includesText: (row, columnId, value) =>
      String(row.getValue(columnId))
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  }

  // -----------------------
  // Columns
  // -----------------------
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
      {
        header: 'Customer',
        accessorKey: 'customer',
      },
      {
        header: 'Assigned Driver',
        accessorKey: 'driver',
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
          const vehicle = info.getValue() as string
          return vehicle ? (
            <span className="text-foreground">{vehicle}</span>
          ) : (
            <span>Unassigned</span>
          )
        },
      },
      {
        header: 'Pickup Address',
        accessorKey: 'pickupLocation',
        cell: (info) => {
          const location = info.getValue() as string
          return location ? (
            <span className=" text-foreground truncate">{location}</span>
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
          const orderRef = order.orderRef // adjust as needed

          const isCreated = order.status === 'CREATED'
          const isAssigned = order.status === 'ASSIGNED'
          const isPickedUp = order.status === 'PICKED_UP'
          const isInTransit = order.status === 'IN_TRANSIT'
          const isDelivered = order.status === 'DELIVERED'
          const isDeleted = order.status === 'DELETED'

          const showTrack = isAssigned || isPickedUp || isInTransit
          const showSoftDelete = softDeleteOrders && isCreated
          const showRestore = softDeleteOrders && isDeleted
          const showPermanentDelete = softDeleteOrders && isDeleted
          const showManualComplete =
            allowManualOrderCompletion &&
            (isAssigned || isPickedUp || isInTransit)

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={12} className="text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit shadow border border-border/30 rounded-sm flex flex-col p-1.5">
                {/* View – always present */}
                <Link
                  className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer"
                  to="/apps/$companyId/orders/$orderRef"
                  params={{ companyId, orderRef }}
                >
                  <Eye size={14} />
                  <span>View</span>
                </Link>

                {/* Track Order */}
                {showTrack && (
                  <Link
                    className="w-full text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition hover:bg-accent py-2 px-1.5 font-medium rounded-md cursor-pointer"
                    to="/apps/$companyId/tracking"
                    params={{ companyId }}
                    search={{ trackingNumber: order.trackingNumber }}
                  >
                    <MapPin size={14} />
                    <span>Track Order</span>
                  </Link>
                )}

                {/* Manual Complete */}
                {showManualComplete && (
                  <MarkAsCompleted orderReference={orderRef} />
                )}

                {/* Soft Delete */}
                {showSoftDelete && <DeleteOrder orderReference={orderRef} />}

                {/* Restore */}
                {showRestore && <RestoreOrder orderReference={orderRef} />}

                {/* Permanent Delete */}
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

  // -----------------------
  // Table
  // -----------------------
  const table = useReactTable({
    data: tableData,
    columns,
    filterFns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
  })

  // -----------------------
  // Filtered rows (GLOBAL + APPLIED FILTERS)
  // -----------------------
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
        !o.driver.toLowerCase().includes(filters.driver.toLowerCase())
      )
        return false

      if (
        filters.vehicle &&
        !o.vehicle.toLowerCase().includes(filters.vehicle.toLowerCase())
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

  // -----------------------
  // Animation Styles
  // -----------------------
  const animationKey = `${pageIndex}-${globalSearch}-${JSON.stringify(filters)}`
  const rowVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    exit: {
      opacity: 0,
      y: 8,
      transition: {
        duration: 0.12,
        ease: easeIn,
      },
    },
  }

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="flex flex-col gap-6  w-full  h-full">
      {/* Toolbar */}
      {enableSearchAndFilter && (
        <div className="flex flex-row gap-2 w-full justify-start md:justify-end">
          {selectedRows.size > 0 ? (
            <AnimatePresence mode="popLayout">
              <motion.div
                className="flex items-center gap-3 md:gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  ease: easeOut,
                }}
                exit={{ opacity: 0 }}
              >
                <Button
                  variant="outline"
                  leftIcon={<UploadCloudIcon size={16} />}
                  size={'sm'}
                  className="text-xs"
                >
                  Export ({selectedRows.size})
                </Button>

                {/*
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      leftIcon={<Trash2Icon size={16} />}
                      size="sm"
                      className="text-xs"
                      disabled={selectedRows.size === 0}
                    >
                      Delete ({selectedRows.size})
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-base">
                        Delete selected items
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        You are about to delete{' '}
                        <span className="font-medium">{selectedRows.size}</span>{' '}
                        item(s). This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 py-2">
                      <Label className="text-sm font-medium flex gap-0.5 items-center">
                        Reason for deletion{' '}
                        <span className="text-destructive">
                          <Asterisk size={10} />
                        </span>
                      </Label>
                      <Input
                        placeholder="e.g. Duplicate records, incorrect data…"
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        required
                        autoFocus
                        autoComplete="on"
                      />
                      <p className="text-xs text-muted-foreground">
                        This reason will be stored for audit purposes.
                      </p>
                    </div>

                    <DialogFooter className="gap-2 flex items-center">
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deleteReason.trim().length < 3}
                        onClick={handleDeleteSelected}
                      >
                        Confirm delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                 */}
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              {' '}
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
                leftIcon={<SlidersHorizontalIcon size={16} />}
                size={'sm'}
                onClick={() => {
                  setDraftFilters(filters)
                  setFilterDialogOpen(true)
                }}
                className="text-xs"
              >
                Filters
              </Button>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 justify-between gap-6 ">
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

        {/** Pagination */}
        {enablePagination && (
          <div className="flex items-center justify-between ">
            {/* Page size / rows info */}
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
                {/* Back */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isFirstPage}
                  onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                >
                  <ArrowLeft size={14} />
                </Button>

                {/* Page number */}
                <Button
                  size="sm"
                  className="text-foreground pointer-events-none"
                  variant="outline"
                >
                  {pageIndex + 1}
                </Button>

                {/* Next */}
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

      {/* ---------------- FILTER DIALOG ---------------- */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Status */}
            <div>
              <Label className="mb-2">Order status</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(OrderStatuses).map((status) => (
                  <Label
                    key={status}
                    className="flex items-center gap-2 rounded-md border p-1.5 cursor-pointer hover:bg-accent"
                  >
                    <Checkbox
                      checked={draftFilters.statuses.includes(status)}
                      onCheckedChange={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          statuses: prev.statuses.includes(status)
                            ? prev.statuses.filter((s) => s !== status)
                            : [...prev.statuses, status],
                        }))
                      }
                    />
                    <span className="text-[13px] capitalize">
                      {status.replace('_', ' ').toLowerCase()}
                    </span>
                  </Label>
                ))}
              </div>
            </div>

            {/* Driver / Vehicle */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Driver name"
                size="sm"
                className="text-xs"
                value={draftFilters.driver}
                onChange={(e) =>
                  setDraftFilters((p) => ({
                    ...p,
                    driver: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Vehicle"
                size="sm"
                className="text-xs"
                value={draftFilters.vehicle}
                onChange={(e) =>
                  setDraftFilters((p) => ({
                    ...p,
                    vehicle: e.target.value,
                  }))
                }
              />
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                size="sm"
                type="date"
                value={draftFilters.startDate}
                onChange={(e) =>
                  setDraftFilters((p) => ({
                    ...p,
                    startDate: e.target.value,
                  }))
                }
              />
              <Input
                size="sm"
                type="date"
                value={draftFilters.endDate}
                onChange={(e) =>
                  setDraftFilters((p) => ({
                    ...p,
                    endDate: e.target.value,
                  }))
                }
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <Button
                variant="ghost"
                size={'sm'}
                onClick={() =>
                  setDraftFilters({
                    statuses: [],
                    driver: '',
                    vehicle: '',
                    startDate: '',
                    endDate: '',
                  })
                }
              >
                Reset
              </Button>
              <Button
                size={'sm'}
                onClick={() => {
                  setFilters(draftFilters) // ✅ apply
                  setFilterDialogOpen(false)
                }}
              >
                Apply filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
