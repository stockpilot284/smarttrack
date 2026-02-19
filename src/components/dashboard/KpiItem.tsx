import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCountUp } from '@/hooks/use-count-up'
import { KpiItemProps } from './KpiOverview'

export default function KpiItem({ data }: { data: KpiItemProps }) {
  let isPositive
  let isNegative

  if (data?.percentageChange) {
    isPositive = data.percentageChange > 0
    isNegative = data.percentageChange < 0
  }

  const trendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus
  const trendColor = isPositive
    ? 'text-green-500'
    : isNegative
      ? 'text-red-500'
      : 'text-muted-foreground'

  const TrendIcon = trendIcon

  /** Animate main KPI value */
  const isPercentageValue =
    typeof data.value === 'string' && data.value.includes('%')

  const numericValue = isPercentageValue
    ? Number((data.value as string).replace('%', ''))
    : Number(data.value)

  const animatedValue = useCountUp(numericValue)

  return (
    <li className="w-full h-[132px] rounded-md bg-background flex p-4 shadow-xs transition-all justify-between items-start ">
      <div className="flex flex-col gap-4 flex-1">
        {/* Label */}
        <p className="text-[13px] font-medium text-foreground">{data.label}</p>

        {/* Animated Value */}
        <span className="text-2xl font-bold tabular-nums">
          {animatedValue > 0 ? animatedValue : <Minus />}
          {isPercentageValue && animatedValue > 0 && '%'}
        </span>

        {/* Percentage change */}
        {data.percentageChange && (
          <div className="flex items-center w-fit gap-1.5">
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trendColor,
              )}
            >
              <TrendIcon size={16} />
              <span>{Math.abs(data.percentageChange)}%</span>
            </div>

            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${data.styles}`}
      >
        {<data.Icon size={24} />}
      </div>
    </li>
  )
}
