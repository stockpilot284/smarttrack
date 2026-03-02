import { LucideIcon, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCountUp } from '@/hooks/use-count-up'
import { DriverKpiItemProps } from '@/types/driver.type'

export default function DriverKpiItem({ data }: { data: DriverKpiItemProps }) {
  const { label, value, Icon, styles, helperText } = data

  /** Animate KPI value */
  const isPercentageValue = typeof value === 'string' && value.includes('%')

  const numericValue = isPercentageValue
    ? Number(value.replace('%', ''))
    : Number(value)

  const animatedValue = useCountUp(numericValue)

  return (
    <li className="w-full h-[132px] rounded-md bg-card flex p-4 shadow-xs transition-all justify-between items-start dark:border dark:border-border">
      {/* LEFT */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Label */}
        <p className="text-[13px] font-medium text-foreground">{label}</p>

        {/* Value */}
        <span className="text-2xl font-bold tabular-nums">
          {animatedValue > 0 ? animatedValue : <Minus />}
          {isPercentageValue && animatedValue > 0 && '%'}
        </span>

        <span className="text-xs text-muted-foreground">{helperText}</span>
      </div>

      {/* ICON */}
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          styles,
        )}
      >
        <Icon size={22} />
      </div>
    </li>
  )
}
