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
  Trash2Icon,
  Eye,
  PencilIcon,
  Asterisk,
  Users,
  Mail,
  Phone,
  Pause,
  Calendar,
  UserX,
} from 'lucide-react'

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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Link, useParams } from '@tanstack/react-router'
import {
  DriverAvailabilities,
  DriverAvailability,
  DriversTableProps,
  DriverStatus,
  DriverStatuses,
  DriverTable,
} from '@/types/driver.type'
import DriversStatusBadge from './DriverStatusBadge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import DeleteDriver from './DeleteDriver'
import SuspendDriver from './SupendDriver'
import { format } from 'date-fns'
import { avatarClass } from '@/utils/avatar-styles'
import MarkInactiveDriver from './MarkInactiveDriver'
import MarkActiveDriver from './MarkActiveDriver'
import RestoreDriver from './RestoreDriver'
import PermanentDeleteDriver from './PermantelyDeleteDriver'

// -----------------------
// 3️⃣ Component
// -----------------------
export default function DriversTable({
  data,
  enableSearchAndFilter = false,
  enableRowSelection = false,
  enableActionsColumn = false,
  enablePagination = false,
}: DriversTableProps) {
  // -----------------------
  // State
  // -----------------------
  const [tableData] = useState<DriverTable[]>(data)
  const [globalSearch, setGlobalSearch] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)
  const [deleteReason, setDeleteReason] = useState('')
  const [searchInput, setSearchInput] = useState('') // Temporary state for input

  useEffect(() => {
    const handler = setTimeout(() => {
      setGlobalSearch(searchInput) // Update globalSearch after debounce delay
    }, 1000) // 1-second debounce

    return () => {
      clearTimeout(handler) // Clear timeout if user types again before delay
    }
  }, [searchInput])

  const { companyId } = useParams({
    from: '/apps/$companyId',
  })

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
    statuses: [] as DriverStatus[],
    driver: '',
    startDate: '',
    endDate: '',
    phone: '',
    availability: '', // Added availability property
  })

  // ✅ Draft filters (used inside dialog only)
  const [draftFilters, setDraftFilters] = useState(filters)

  // -----------------------
  // Filter functions
  // -----------------------
  const filterFns: Record<string, FilterFn<DriverTable>> = {
    includesText: (row, columnId, value) =>
      String(row.getValue(columnId))
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  }

  // -----------------------
  // Columns
  // -----------------------
  const columns = useMemo<ColumnDef<DriverTable>[]>(() => {
    const cols: ColumnDef<DriverTable>[] = []

    // if (enableRowSelection) {
    //   cols.push({
    //     id: 'select',
    //     header: () => (
    //       <Checkbox
    //         size="sm"
    //         checked={
    //           selectedRows.size > 0 && selectedRows.size === tableData.length
    //         }
    //         onCheckedChange={(checked) =>
    //           setSelectedRows(
    //             checked ? new Set(tableData.map((d) => d.id)) : new Set(),
    //           )
    //         }
    //       />
    //     ),
    //     cell: ({ row }) => (
    //       <Checkbox
    //         size="sm"
    //         checked={selectedRows.has(row.original.id)}
    //         onCheckedChange={(checked) => {
    //           const next = new Set(selectedRows)
    //           checked ? next.add(row.original.id) : next.delete(row.original.id)
    //           setSelectedRows(next)
    //         }}
    //       />
    //     ),
    //   })
    // }

    cols.push(
      {
        header: 'Name',
        accessorKey: 'name',
        filterFn: filterFns.includesText,
        cell: (info) => {
          const name = info.getValue() as string
          return (
            <div className="flex items-center gap-4">
              <Avatar size="default">
                <AvatarFallback className={`${avatarClass(name)}`}>
                  {name[0]}
                </AvatarFallback>
              </Avatar>
              <span className=" text-foreground">{name}</span>
            </div>
          )
        },
      },
      {
        header: 'Email',
        accessorKey: 'email',
        filterFn: filterFns.includesText,
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
        filterFn: filterFns.includesText,
        cell: (info) => {
          const phone = info.getValue() as string
          return <span className=" text-foreground">+{phone}</span>
        },
      },
      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: (info) => {
          const date = new Date(info.getValue() as string)
          return (
            <span className=" text-foreground">
              {format(date, 'MMM dd, yyyy')}
            </span>
          )
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => (
          <DriversStatusBadge status={info.getValue() as DriverStatus} />
        ),
      },
      {
        header: 'Availability',
        accessorKey: 'availability',
        cell: (info) => {
          const availability = info.getValue() as DriverAvailability
          return availability
            .replace('_', ' ')
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase())
        },
        filterFn: filterFns.includesText,
      },
    )

    // Inside your table columns definition
    if (enableActionsColumn) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const driver = info.row.original
          const isActive = driver.status === 'ACTIVE'
          const isSuspended = driver.status === 'SUSPENDED'
          const isInactive = driver.status === 'INACTIVE'
          const isDeleted = driver.status === 'DELETED'
          const isBusy = driver.availability === 'BUSY'

          // Determine which actions to show
          let showDelete = false
          let showSuspend = false
          let showMarkInactive = false
          let showMarkActive = false
          let showRestore = false
          let showPermanentDelete = false

          if (isDeleted) {
            // Deleted: only restore and permanently delete
            showRestore = true
            showPermanentDelete = true
          } else if (isActive && isBusy) {
            // Active & busy: no actions
            // all false
          } else if (isSuspended) {
            // Suspended: only mark as active
            showMarkActive = true
          } else if (isInactive) {
            // Inactive: mark as active, suspend, delete
            showMarkActive = true
            showSuspend = true
            showDelete = true
          } else {
            // Default (active & available): delete, suspend, mark inactive
            showDelete = true
            showSuspend = true
            showMarkInactive = true
          }

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={12} className="text-muted-foreground" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-fit shadow border border-border/30 rounded-sm flex flex-col p-1.5">
                {showDelete && <DeleteDriver driverId={driver.id} />}
                {showSuspend && <SuspendDriver driverId={driver.id} />}
                {showMarkInactive && (
                  <MarkInactiveDriver driverId={driver.id} />
                )}
                {showMarkActive && <MarkActiveDriver driverId={driver.id} />}
                {showRestore && <RestoreDriver driverId={driver.id} />}
                {showPermanentDelete && (
                  <PermanentDeleteDriver driverId={driver.id} />
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

      // Handle global search
      if (globalSearch) {
        const searchQuery = globalSearch.toLowerCase()

        const match = ['name', 'phone', 'email'].some((key) => {
          const value = o[key as keyof DriverTable]
          return value?.toString().toLowerCase().includes(searchQuery)
        })

        // Check if the search query matches the createdAt date
        const createdAtMatch = o.createdAt
          ? new Date(o.createdAt)
              .toLocaleDateString('en-US')
              .includes(searchQuery)
          : false

        if (!match && !createdAtMatch) return false
      }

      // Filter by statuses
      if (filters.statuses.length > 0 && !filters.statuses.includes(o.status)) {
        return false
      }

      // Filter by driver name
      if (
        filters.driver &&
        o.name?.toLowerCase().indexOf(filters.driver.toLowerCase()) === -1
      ) {
        return false
      }

      // Filter by availability
      if (filters.availability && o.availability !== filters.availability) {
        return false
      }

      // Filter by phone
      if (
        filters.phone &&
        o.phone?.toLowerCase().indexOf(filters.phone.toLowerCase()) === -1
      ) {
        return false
      }

      // Filter by createdAt (startDate and endDate)
      if (filters.startDate) {
        const startDate = new Date(filters.startDate)
        const createdAt = new Date(o.createdAt)
        if (isNaN(startDate.getTime()) || createdAt < startDate) {
          return false
        }
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        const createdAt = new Date(o.createdAt)
        if (isNaN(endDate.getTime()) || createdAt > endDate) {
          return false
        }
      }

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
                        driver(s). This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Reason input */}
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
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              {' '}
              <Input
                type="search"
                placeholder="Search name, email, phone..."
                value={searchInput}
                size="sm"
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border-border/50"
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
                      title="No Drivers Found"
                      description="There are no drivers to display. New drivers will appear here, or try adjusting your search and filters."
                      Icon={UserX}
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
              <Label className="mb-2 text-muted-foreground">
                Driver status
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(DriverStatuses).map((status) => (
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

            {/* Availability */}
            <div>
              <Label className="mb-2 text-muted-foreground">
                Driver availability
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(DriverAvailabilities).map((availability) => (
                  <Label
                    key={availability}
                    className="flex items-center gap-2 rounded-md border p-1.5 cursor-pointer hover:bg-accent"
                  >
                    <Checkbox
                      checked={draftFilters.availability === availability}
                      onCheckedChange={(checked) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          availability: checked ? availability : '',
                        }))
                      }
                    />
                    <span className="text-[13px] capitalize">
                      {availability.replace('_', ' ').toLowerCase()}
                    </span>
                  </Label>
                ))}
              </div>
            </div>

            {/* Created At Date Range */}
            <div>
              <Label className="mb-2 text-muted-foreground">Created At</Label>
              <div className="grid grid-cols-2 gap-2 mt-6">
                <div className="flex flex-col gap-1.5">
                  <Label className="">Start Date</Label>
                  <Input
                    type="date"
                    value={draftFilters.startDate}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="">End Date</Label>
                  <Input
                    type="date"
                    value={draftFilters.endDate}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
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
                    phone: '',
                    startDate: '',
                    endDate: '',
                    availability: '',
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
