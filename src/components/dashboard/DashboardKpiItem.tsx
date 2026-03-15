import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useCountUp } from '@/hooks/use-count-up'
import { DashboardKpiItemProps } from './DashboardKpiOverview'

export default function DashboardKpiItem({
  data,
}: {
  data: DashboardKpiItemProps
}) {
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
    <Card className="w-full h-[132px] flex flex-col gap-0 py-4">
      <CardHeader className="text-[13px] font-medium text-foreground px-4 ">
        <CardTitle>{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-full flex justify-between items-start">
        {/* Left side: label, value, change */}
        <div className="flex flex-col gap-4 flex-1">
          <span className="text-2xl font-bold tabular-nums">
            {animatedValue > 0 ? animatedValue : <Minus />}
            {isPercentageValue && animatedValue > 0 && '%'}
          </span>

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

              <span className="text-xs text-muted-foreground">
                vs last month
              </span>
            </div>
          )}
        </div>

        {/* Right side: icon circle */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary">
          {<data.Icon size={22} />}
        </div>
      </CardContent>
    </Card>
  )
}
