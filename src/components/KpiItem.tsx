import { LucideIcon, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCountUp } from '@/hooks/use-count-up'
import { FleetKpiItemProps } from '@/types/vehicle.type'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'

export type KpiItemProps = {
  label: string
  value: number | string
  Icon: LucideIcon
  helperText: string
}

export default function KpiItem({ data }: { data: KpiItemProps }) {
  const { label, value, Icon, helperText } = data

  /** Animate KPI value */
  const isPercentageValue = typeof value === 'string' && value.includes('%')

  const numericValue = isPercentageValue
    ? Number(value.replace('%', ''))
    : Number(value)

  const animatedValue = useCountUp(numericValue)

  return (
    <Card className="w-full h-[132px] flex flex-col gap-0 py-4">
      <CardHeader className="text-[13px] font-medium text-foreground px-4 ">
        <CardTitle>{label}</CardTitle>
      </CardHeader>

      <CardContent className="h-full  flex justify-between items-center">
        <div className="flex flex-col gap-4 flex-1">
          {/* Value */}
          <span className="text-2xl font-bold tabular-nums">
            {animatedValue > 0 ? animatedValue : <Minus />}
            {isPercentageValue && animatedValue > 0 && '%'}
          </span>
        </div>

        {/* ICON */}
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary',
          )}
        >
          <Icon size={22} />
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">{helperText}</span>
      </CardFooter>
    </Card>
  )
}
