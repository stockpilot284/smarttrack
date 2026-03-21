import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StatusFilterTabsProps {
  value: string
  onValueChange: (value: string) => void
}

export function StatusFilterTabs({
  value,
  onValueChange,
}: StatusFilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="w-full max-w-3xl" variant={'line'}>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="in_transit">In Transit</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="assigned">Assigned</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        <TabsTrigger value="failed">Failed</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
