// components/members/MembersTable.tsx
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
  Trash2Icon,
  Asterisk,
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
import { useParams } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { format } from 'date-fns'
import { avatarClass } from '@/utils/avatar-styles'

import { EditRole } from './EditRole'
import { ResendInvite } from './ResendInvite'
import { SuspendMember } from './SuspendMember'
import { ActivateMember } from './ActivateMember'
import { RemoveMember } from './RemoveMember'
import { RestoreMember } from './RestoreMember'
import { PermanentDeleteMember } from './PermanentDeleteMember'
import {
  Member,
  MemberRole,
  MembersTableProps,
  MemberStatus,
} from '@/types/member.type'
import { RoleBadge } from '../RoleBadge'
import { StatusBadge } from '../StatusBadge'

export default function MembersTable({
  data,
  enableSearchAndFilter = false,
  enableRowSelection = false,
  enableActionsColumn = false,
  enablePagination = false,
}: MembersTableProps) {
  // -----------------------
  // State
  // -----------------------
  const [tableData] = useState<Member[]>(data)
  const [globalSearch, setGlobalSearch] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)
  const [deleteReason, setDeleteReason] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setGlobalSearch(searchInput)
    }, 1000)
    return () => clearTimeout(handler)
  }, [searchInput])

  const { companyId } = useParams({ from: '/apps/$companyId' })

  const handleDeleteSelected = () => {
    if (!deleteReason.trim()) return
    const payload = { ids: Array.from(selectedRows), reason: deleteReason }
    console.log('Deleting members:', payload)
    // TODO: API call, then clear selection
    setDeleteReason('')
    setSelectedRows(new Set())
  }

  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    roles: [] as MemberRole[],
    statuses: [] as MemberStatus[],
    startDate: '',
    endDate: '',
  })
  const [draftFilters, setDraftFilters] = useState(filters)

  // -----------------------
  // Filter functions
  // -----------------------
  const filterFns: Record<string, FilterFn<Member>> = {
    includesText: (row, columnId, value) =>
      String(row.getValue(columnId))
        .toLowerCase()
        .includes(String(value).toLowerCase()),
  }

  // -----------------------
  // Columns
  // -----------------------
  const columns = useMemo<ColumnDef<Member>[]>(() => {
    const cols: ColumnDef<Member>[] = []

    // Row selection checkbox (optional)
    if (enableRowSelection) {
      // Determine which members are eligible for selection (not OWNER)
      const eligibleMembers = tableData.filter((m) => m.role !== 'OWNER')
      const allEligibleSelected =
        eligibleMembers.length > 0 &&
        eligibleMembers.every((m) => selectedRows.has(m.id))

      cols.push({
        id: 'select',
        header: () => (
          <Checkbox
            size="sm"
            checked={allEligibleSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedRows(new Set(eligibleMembers.map((m) => m.id)))
              } else {
                setSelectedRows(new Set())
              }
            }}
            disabled={eligibleMembers.length === 0}
          />
        ),
        cell: ({ row }) => {
          const member = row.original
          const isOwner = member.role === 'OWNER'
          return (
            <Checkbox
              size="sm"
              checked={selectedRows.has(member.id)}
              onCheckedChange={(checked) => {
                const next = new Set(selectedRows)
                if (checked) {
                  if (!isOwner) next.add(member.id)
                } else {
                  next.delete(member.id)
                }
                setSelectedRows(next)
              }}
              disabled={isOwner}
            />
          )
        },
      })
    }

    cols.push(
      {
        header: 'Name',
        accessorKey: 'name',
        filterFn: filterFns.includesText,
        cell: (info) => {
          const name = info.getValue() as string
          const member = info.row.original
          return (
            <div className="flex items-center gap-4">
              <Avatar size="default">
                <AvatarImage src={member.imageUrl} />
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
            <span>{phone}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        },
      },
      {
        header: 'Role',
        accessorKey: 'role',
        cell: (info) => {
          const role = info.getValue() as MemberRole
          return (
            <RoleBadge role={role} />
            // <span className="capitalize px-2 py-1 rounded-full bg-muted text-xs">
            //   {role.toLowerCase()}
            // </span>
          )
        },
      },

      {
        header: 'Joined',
        accessorKey: 'joinedAt',
        cell: (info) => {
          const date = info.getValue() as string
          return format(new Date(date), 'MMM dd, yyyy')
        },
      },
      {
        header: 'Last Active',
        accessorKey: 'lastActiveAt',
        cell: (info) => {
          const date = info.getValue() as string | undefined
          return date ? (
            format(new Date(date), 'MMM dd, yyyy')
          ) : (
            <span className="text-muted-foreground">—</span>
          )
        },
      },

      {
        header: 'Status',
        accessorKey: 'status',
        cell: (info) => {
          const status = info.getValue() as MemberStatus

          return <StatusBadge status={status} variant="member" size="md" />
        },
      },
    )

    if (enableActionsColumn) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const member = info.row.original
          const disabled = member.role === 'OWNER'
          const isActive = member.status === 'ACTIVE'
          const isInvited = member.status === 'INVITED'
          const isSuspended = member.status === 'SUSPENDED'
          const isDeleted = member.status === 'DELETED'

          let showEditRole = false
          let showResendInvite = false
          let showSuspend = false
          let showActivate = false
          let showRemove = false
          let showRestore = false
          let showPermanentDelete = false

          if (isDeleted) {
            showRestore = true
            showPermanentDelete = true
          } else if (isInvited) {
            showResendInvite = true
            showRemove = true // remove invitation
          } else if (isSuspended) {
            showActivate = true
            showEditRole = true
            showRemove = true
          } else if (isActive) {
            showEditRole = true
            showSuspend = true
            showRemove = true
          }

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" disabled={disabled}>
                  <MoreVertical size={12} className="text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit shadow border border-border/30 rounded-sm flex flex-col p-1.5">
                {showEditRole && (
                  <EditRole memberId={member.id} currentRole={member.role} />
                )}
                {showResendInvite && <ResendInvite memberId={member.id} />}
                {showSuspend && <SuspendMember memberId={member.id} />}
                {showActivate && <ActivateMember memberId={member.id} />}
                {showRemove && <RemoveMember memberId={member.id} />}
                {showRestore && <RestoreMember memberId={member.id} />}
                {showPermanentDelete && (
                  <PermanentDeleteMember memberId={member.id} />
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
  // Table instance
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
      const m = row.original

      // Global search
      if (globalSearch) {
        const query = globalSearch.toLowerCase()
        const match =
          m.name?.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query) ||
          m.phone?.toLowerCase().includes(query)
        if (!match) return false
      }

      // Role filter
      if (filters.roles.length > 0 && !filters.roles.includes(m.role))
        return false
      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(m.status))
        return false
      // Date range
      if (filters.startDate) {
        const start = new Date(filters.startDate)
        const joined = new Date(m.joinedAt)
        if (joined < start) return false
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate)
        const joined = new Date(m.joinedAt)
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

  // Animation key
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

  // -----------------------
  // Render
  // -----------------------
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
                        Delete selected members
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        You are about to delete{' '}
                        <span className="font-medium">{selectedRows.size}</span>{' '}
                        member(s). This action can be undone later if soft
                        delete is enabled.
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
                        placeholder="e.g. Duplicate accounts, left company..."
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        required
                        autoFocus
                      />
                      <p className="text-xs text-muted-foreground">
                        This reason will be stored for audit purposes.
                      </p>
                    </div>
                    <DialogFooter className="gap-2 flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilterDialogOpen(false)}
                      >
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
            </>
          )}
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
                      title="No Members Found"
                      description="There are no members to display. Invite new members or adjust your filters."
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
            <DialogTitle>Filter Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {/* Role */}
            <div>
              <Label className="mb-2 text-muted-foreground">Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {['OWNER', 'ADMIN', 'DISPATCHER', 'DRIVER', 'CUSTOMER'].map(
                  (role) => (
                    <Label
                      key={role}
                      className="flex items-center gap-2 rounded-md border p-1.5 cursor-pointer hover:bg-accent"
                    >
                      <Checkbox
                        checked={draftFilters.roles.includes(
                          role as MemberRole,
                        )}
                        onCheckedChange={() =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            roles: prev.roles.includes(role as MemberRole)
                              ? prev.roles.filter((r) => r !== role)
                              : [...prev.roles, role as MemberRole],
                          }))
                        }
                      />
                      <span className="text-[13px] capitalize">
                        {role.toLowerCase()}
                      </span>
                    </Label>
                  ),
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <Label className="mb-2 text-muted-foreground">Status</Label>
              <div className="grid grid-cols-2 gap-2">
                {['ACTIVE', 'INVITED', 'SUSPENDED', 'DELETED'].map((status) => (
                  <Label
                    key={status}
                    className="flex items-center gap-2 rounded-md border p-1.5 cursor-pointer hover:bg-accent"
                  >
                    <Checkbox
                      checked={draftFilters.statuses.includes(
                        status as MemberStatus,
                      )}
                      onCheckedChange={() =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          statuses: prev.statuses.includes(
                            status as MemberStatus,
                          )
                            ? prev.statuses.filter((s) => s !== status)
                            : [...prev.statuses, status as MemberStatus],
                        }))
                      }
                    />
                    <span className="text-[13px] capitalize">
                      {status.toLowerCase()}
                    </span>
                  </Label>
                ))}
              </div>
            </div>

            {/* Joined Date Range */}
            <div>
              <Label className="mb-2 text-muted-foreground">Joined Date</Label>
              <div className="grid grid-cols-2 gap-2">
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
                    roles: [],
                    statuses: [],
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
