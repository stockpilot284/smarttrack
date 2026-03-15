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
  SlidersHorizontalIcon,
  ArrowUpDownIcon,
  ArrowLeft,
  ArrowRightIcon,
  UserX,
  Eye,
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import EmptyState from '@/components/EmptyState'
import { motion, AnimatePresence, easeInOut, easeIn } from 'framer-motion'
import { Link, useParams } from '@tanstack/react-router'
import {
  DriverAvailabilities,
  DriverAvailability,
  DriversTableProps,
  DriverStatus,
  DriverStatuses,
  DriverTable,
} from '@/types/driver.type'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { format } from 'date-fns'
import { avatarClass } from '@/utils/avatar-styles'
import { StatusBadge } from '@/components/StatusBadge'

// Simple placeholder action components (replace with real ones later)
function AssignVehicle({ driverId }: { driverId: string }) {
  return (
    <Button variant="ghost" size="sm" className="w-full justify-start">
      Assign Vehicle
    </Button>
  )
}

function ViewDriverDetails({ driverId }: { driverId: string }) {
  return (
    <Button variant="ghost" size="sm" className="w-full justify-start">
      View Details
    </Button>
  )
}

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
  const [searchInput, setSearchInput] = useState('')

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setGlobalSearch(searchInput)
    }, 1000)
    return () => clearTimeout(handler)
  }, [searchInput])

  const { companyId } = useParams({ from: '/apps/$companyId' })

  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  // Applied filters
  const [filters, setFilters] = useState({
    statuses: [] as DriverStatus[],
    availability: '' as DriverAvailability | '',
    startDate: '',
    endDate: '',
  })

  // Draft filters (for dialog)
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

    // Optional row selection (if needed)

    cols.push(
      {
        header: 'Name',
        accessorKey: 'name',
        filterFn: filterFns.includesText,
        cell: (info) => {
          const driver = info.row.original
          const name = info.getValue() as string
          return (
            <div className="flex items-center gap-4">
              <Avatar size="default">
                <AvatarImage src={driver.imageUrl} className="object-cover" />
                <AvatarFallback className={avatarClass(name)}>
                  {name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground">{name}</span>
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
          return phone ? (
            <span>+{phone}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => {
          const status = info.getValue() as DriverStatus
          return <StatusBadge status={status} variant="member" />
        },
      },
      {
        header: 'Availability',
        accessorKey: 'availability',
        cell: (info) => {
          const availability = info.getValue() as DriverAvailability
          return <StatusBadge status={availability} variant="driver" />
        },
      },

      {
        header: 'Joined',
        accessorKey: 'createdAt',
        cell: (info) => {
          const date = new Date(info.getValue() as string)
          return format(date, 'MMM dd, yyyy')
        },
      },
      {
        header: 'Vehicle',
        accessorKey: 'vehicle',
        cell: (info) => {
          const vehicle = info.getValue() as
            | { model: string; plate: string }
            | undefined
          return vehicle ? (
            <div className="text-sm">
              <div>{vehicle.model}</div>
              <div className="text-[11px] text-muted-foreground">
                {vehicle.plate}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        },
      },
      {
        header: 'Current Trip',
        accessorKey: 'currentTrip',
        cell: (info) => {
          const trip = info.getValue() as
            | { destination: string; status: string }
            | undefined
          return trip ? (
            <div className="text-sm">
              <div className="truncate max-w-[150px]">{trip.destination}</div>
              <div className="text-[11px] text-muted-foreground">
                {trip.status}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        },
      },
    )

    // Actions column (driver-specific)
    if (enableActionsColumn) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const driver = info.row.original
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
                  to="/apps/$companyId/drivers/$driverId"
                  params={{ companyId, driverId: driver.id }}
                >
                  <Eye size={14} />
                  <span>View</span>
                </Link>
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
  // Filtered rows
  // -----------------------
  const filteredRows = useMemo(() => {
    return table.getRowModel().rows.filter((row) => {
      const d = row.original

      // Global search
      if (globalSearch) {
        const query = globalSearch.toLowerCase()
        const match =
          d.name?.toLowerCase().includes(query) ||
          d.email?.toLowerCase().includes(query) ||
          d.phone?.toLowerCase().includes(query)
        if (!match) return false
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(d.status)) {
        return false
      }

      // Availability filter
      if (filters.availability && d.availability !== filters.availability) {
        return false
      }

      // Date range
      if (filters.startDate) {
        const start = new Date(filters.startDate)
        const joined = new Date(d.createdAt)
        if (joined < start) return false
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate)
        const joined = new Date(d.createdAt)
        if (joined > end) return false
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

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Toolbar */}
      {enableSearchAndFilter && (
        <div className="flex flex-row gap-2 w-full justify-start md:justify-end">
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
            size="sm"
            onClick={() => {
              setDraftFilters(filters)
              setFilterDialogOpen(true)
            }}
            className="text-xs"
          >
            Filters
          </Button>
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

        {/* Pagination */}
        {enablePagination && (
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

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Filter Drivers</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Status */}
            <div>
              <Label className="mb-2 text-muted-foreground">Status</Label>
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
              <Label className="mb-2 text-muted-foreground">Availability</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(DriverAvailabilities).map((avail) => (
                  <Label
                    key={avail}
                    className="flex items-center gap-2 rounded-md border p-1.5 cursor-pointer hover:bg-accent"
                  >
                    <Checkbox
                      checked={draftFilters.availability === avail}
                      onCheckedChange={(checked) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          availability: checked ? avail : '',
                        }))
                      }
                    />
                    <span className="text-[13px] capitalize">
                      {avail.replace('_', ' ').toLowerCase()}
                    </span>
                  </Label>
                ))}
              </div>
            </div>

            {/* Joined Date Range */}
            <div>
              <Label className="mb-2 text-muted-foreground">Joined Date</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col gap-1.5">
                  <Label>From</Label>
                  <Input
                    type="date"
                    value={draftFilters.startDate}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>To</Label>
                  <Input
                    type="date"
                    value={draftFilters.endDate}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDraftFilters({
                    statuses: [],
                    availability: '',
                    startDate: '',
                    endDate: '',
                  })
                }
              >
                Reset
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setFilters(draftFilters)
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
