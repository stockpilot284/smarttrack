import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import DriverKpiOverview from '@/components/drivers/DriverKpiOverview'
import { driversData } from '@/data/drivers'
import DriversTable from '@/components/drivers/DriversTable'
import AddDriver from '@/components/drivers/AddDriver'
import { useEffect, useState } from 'react'
import { ButtonSkeleton } from '@/components/skeletons/ButtonSkeleton'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import KpiSkeleton from '@/components/skeletons/KpiSkeleton'

export const Route = createFileRoute('/apps/$companyId/drivers/')({
  component: DriversRoute,
})

function DriversRoute() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function simulateFetch() {
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    }

    simulateFetch()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-8">
        <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
          <PageHeader title="Drivers" description={'Loading drivers data...'} />

          {/** CTA Actions */}
          <ButtonSkeleton />
        </div>

        <KpiSkeleton />
        {/** Table Skeleton */}
        <TableSkeleton showToolbar showPagination />
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Drivers"
          description="Manage your delivery drivers and track their availability."
        />

        <AddDriver />
      </div>

      <DriverKpiOverview />

      <section className="bg-background px-4 py-8 md:p-8 rounded-md shadow-xs">
        <DriversTable
          data={driversData}
          enableActionsColumn
          enableRowSelection
          enableSearchAndFilter
          enablePagination
        />
      </section>
    </div>
  )
}
