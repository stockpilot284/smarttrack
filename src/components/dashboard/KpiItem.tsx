import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCountUp } from '@/hooks/use-count-up'
import { KpiItemProps } from './KpiOverview'

export default function KpiItem({ data }: { data: KpiItemProps }) {
  const isPositive = data.percentageChange > 0
  const isNegative = data.percentageChange < 0

  const trendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus
  const trendColor = isPositive
    ? 'text-emerald-600'
    : isNegative
      ? 'text-red-500'
      : 'text-muted-foreground'

  const trendImage = isPositive
    ? '/assets/images/trend-up.svg'
    : isNegative
      ? '/assets/images/trend-down.svg'
      : null

  const TrendIcon = trendIcon

  /** Animate main KPI value */
  const isPercentageValue =
    typeof data.value === 'string' && data.value.includes('%')

  const numericValue = isPercentageValue
    ? Number((data.value as string).replace('%', ''))
    : Number(data.value)

  const animatedValue = useCountUp(numericValue)

  return (
    <li className="w-full h-[132px] rounded-md border border-border flex p-4 shadow-xs transition-all">
      <div className="flex flex-col gap-4 w-full">
        {/* Label */}
        <p className="text-sm font-medium text-foreground">{data.label}</p>

        {/* Animated Value */}
        <span className="text-2xl font-semibold tabular-nums">
          {animatedValue}
          {isPercentageValue && '%'}
        </span>

        {/* Percentage change */}
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
      </div>

      {/* Trend image */}
      {trendImage && (
        <div className="h-full">
          <img
            src={trendImage}
            alt="trend"
            className="w-[80px] h-full opacity-90"
          />
        </div>
      )}
    </li>
  )
}
