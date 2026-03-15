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
  Trash2Icon,
  Eye,
  Asterisk,
  UserX,
  Truck,
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
import { format } from 'date-fns'

import {
  FleetsTableProps,
  FleetTable,
  VehicleAvailabilities,
  VehicleAvailability,
  VehicleStatus,
  VehicleStatuses,
} from '@/types/vehicle.type'
import DeleteVehicle from './DeleteVehicle'
import SuspendVehicle from './SuspendVehicle'
import MarkActiveVehicle from './MarkActiveVehicle'
import RestoreVehicle from './RestoreVehicle'
import PermanentDeleteVehicle from './PermanentDeleteVehicle'
import MaintenanceVehicle from './MaintenanceVehicle'
import { StatusBadge } from '../StatusBadge'

// -----------------------
// 1️⃣ Enum & Types
// -----------------------

// -----------------------
//  Actions
// -----------------------
const actions = [
  {
    label: 'View',
    Icon: Eye,
  },
]

// -----------------------
// 3️⃣ Component
// -----------------------
export default function FleetsTable({
  data,
  enableSearchAndFilter = false,
  enableRowSelection = false,
  enableActionsColumn = false,
  enablePagination = false,
}: FleetsTableProps) {
  // -----------------------
  // State
  // -----------------------
  const [tableData] = useState<FleetTable[]>(data)
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

  const toStartOfDay = (dateStr: string): Date | null => {
    const [year, month, day] = dateStr.split('-').map(Number)
    if (!year || !month || !day) return null
    return new Date(year, month - 1, day, 0, 0, 0, 0) // local start
  }

  const toEndOfDay = (dateStr: string): Date | null => {
    const [year, month, day] = dateStr.split('-').map(Number)
    if (!year || !month || !day) return null
    return new Date(year, month - 1, day, 23, 59, 59, 999) // local end
  }

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
    statuses: [] as VehicleStatus[],
    model: '',
    plateNumber: '',
    startDate: '',
    endDate: '',
    availability: '', // Added availability property
  })

  // ✅ Draft filters (used inside dialog only)
  const [draftFilters, setDraftFilters] = useState(filters)

  // -----------------------
  // Filter functions
  // -----------------------
  const filterFns: Record<string, FilterFn<FleetTable>> = {
    includesText: (row, columnId, value) =>
      String(row.getValue(columnId))
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  }

  // Define allowed actions per status
  const actionsByStatus: Record<
    string,
    {
      delete?: boolean
      suspend?: boolean
      markActive?: boolean
      restore?: boolean
      permanentDelete?: boolean
      maintenance?: boolean
    }
  > = {
    ACTIVE: {
      delete: true,
      suspend: true,
      maintenance: true,
    },
    SUSPENDED: {
      markActive: true,
      maintenance: true,
    },
    INACTIVE: {
      markActive: true,
      suspend: true,
      delete: true,
      maintenance: true,
    },
    MAINTENANCE: {
      markActive: true,
      suspend: true,
      delete: true,
    },
    DELETED: {
      restore: true,
      permanentDelete: true,
    },
  }
  // -----------------------
  // Columns
  // -----------------------
  const columns = useMemo<ColumnDef<FleetTable>[]>(() => {
    const cols: ColumnDef<FleetTable>[] = []

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
        header: 'Model',
        accessorKey: 'model',
        filterFn: filterFns.includesText,
        cell: (info) => {
          const model = info.getValue() as string
          const vehicle = info.row.original
          const [imgError, setImgError] = useState(false)

          return (
            <div className="flex items-center gap-4">
              {vehicle.imageUrl && !imgError ? (
                <img
                  src={vehicle.imageUrl}
                  loading="lazy"
                  alt={model}
                  className="h-12 w-12 rounded-md object-cover border border-border/40"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted border border-border/40">
                  <Truck size={18} className="text-muted-foreground" />
                </div>
              )}
              <span className="text-foreground">{model}</span>
            </div>
          )
        },
      },
      {
        header: 'Vehicle Type',
        accessorKey: 'vehicleType',
        filterFn: filterFns.includesText,
        cell: (info) => {
          const vehicleType = info.getValue() as string
          return (
            <span className="capitalize ">{vehicleType.toLowerCase()}</span>
          )
        },
      },
      {
        header: 'Plate Number',
        accessorKey: 'plateNumber',
        filterFn: filterFns.includesText,
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
          <StatusBadge
            status={info.getValue() as VehicleStatus}
            variant="vehicle"
          />
        ),
      },
      {
        header: 'Availability',
        accessorKey: 'availability',
        cell: (info) => {
          const availability = info.getValue() as VehicleAvailability
          return <StatusBadge variant="vehicle" status={availability} />
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
          const vehicle = info.row.original
          let actions = { ...actionsByStatus[vehicle.status] }

          // If vehicle is active and in use, disable all actions
          if (
            vehicle.status === 'ACTIVE' &&
            vehicle.availability === 'IN_USE'
          ) {
            actions = {}
          }

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
                  to="/apps/$companyId/fleets/$vehicleId"
                  params={{ companyId, vehicleId: vehicle.id }}
                >
                  <Eye size={14} />
                  <span>View</span>
                </Link>

                {actions.delete && (
                  <DeleteVehicle vehicleId={vehicle.id} companyId={companyId} />
                )}
                {actions.suspend && (
                  <SuspendVehicle
                    vehicleId={vehicle.id}
                    companyId={companyId}
                  />
                )}

                {actions.markActive && (
                  <MarkActiveVehicle
                    vehicleId={vehicle.id}
                    companyId={companyId}
                  />
                )}
                {actions.restore && (
                  <RestoreVehicle
                    vehicleId={vehicle.id}
                    companyId={companyId}
                  />
                )}
                {actions.permanentDelete && (
                  <PermanentDeleteVehicle
                    vehicleId={vehicle.id}
                    companyId={companyId}
                  />
                )}
                {actions.maintenance && (
                  <MaintenanceVehicle
                    vehicleId={vehicle.id}
                    companyId={companyId}
                  />
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

        const match = ['model', 'plateNumber'].some((key) => {
          const value = o[key as keyof FleetTable]
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

      // Filter by vehicle model
      if (
        filters.model &&
        o.model?.toLowerCase().indexOf(filters.model.toLowerCase()) === -1
      ) {
        return false
      }

      // Filter by availability
      if (filters.availability && o.availability !== filters.availability) {
        return false
      }

      // Filter by plate number
      if (
        filters.plateNumber &&
        o.plateNumber
          ?.toLowerCase()
          .indexOf(filters.plateNumber.toLowerCase()) === -1
      ) {
        return false
      }

      // Filter by createdAt (startDate and endDate)
      if (filters.startDate) {
        const start = toStartOfDay(filters.startDate)
        if (!start) return false // invalid date
        const createdAt = new Date(o.createdAt)
        if (isNaN(createdAt.getTime()) || createdAt < start) return false
      }

      if (filters.endDate) {
        const end = toEndOfDay(filters.endDate)
        if (!end) return false
        const createdAt = new Date(o.createdAt)
        if (isNaN(createdAt.getTime()) || createdAt > end) return false
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
          <Input
            type="search"
            placeholder="Search model, plate number"
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
                      title="No Vehicles Found"
                      description="There are no vehicles to display. New vehicles will appear here, or try adjusting your search and filters."
                      Icon={Truck}
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
                Vehicle status
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(VehicleStatuses).map((status) => (
                  <Label
                    key={status}
                    className="flex items-center gap-2 rounded-md border p-1.5 cursor-pointer hover:bg-accent"
                  >
                    <Checkbox
                      checked={draftFilters.statuses.includes(
                        status as VehicleStatus,
                      )}
                      onCheckedChange={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          statuses: (prev.statuses.includes(
                            status as VehicleStatus,
                          )
                            ? prev.statuses.filter((s) => s !== status)
                            : [...prev.statuses, status]) as VehicleStatus[],
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
                Vehicle availability
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(VehicleAvailabilities).map((availability) => (
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
                    model: '',
                    plateNumber: '',
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
