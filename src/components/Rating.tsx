// components/ui/rating.tsx
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useRef, useCallback } from 'react'

interface RatingProps {
  value: number
  onChange?: (value: number) => void
  precision?: 0.5 | 1
  size?: number
  readOnly?: boolean
  className?: string
  starClassName?: string
}

export function Rating({
  value,
  onChange,
  precision = 0.5,
  size = 16,
  readOnly = false,
  className,
  starClassName,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInteractive = !readOnly && !!onChange

  // Calculate value based on mouse position within a star
  const getValueFromEvent = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return 0

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const starWidth = rect.width / 5
      const starIndex = Math.floor(x / starWidth)
      const starFraction = (x % starWidth) / starWidth

      let rawValue = starIndex + 1
      if (precision === 0.5) {
        rawValue = starIndex + (starFraction < 0.5 ? 0.5 : 1)
      }
      return Math.max(0.5, Math.min(5, rawValue))
    },
    [precision],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) return
      const newHover = getValueFromEvent(e)
      setHoverValue(newHover)
    },
    [isInteractive, getValueFromEvent],
  )

  const handleMouseLeave = useCallback(() => {
    if (!isInteractive) return
    setHoverValue(null)
  }, [isInteractive])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isInteractive) return
      const newValue = getValueFromEvent(e)
      onChange?.(newValue)
    },
    [isInteractive, getValueFromEvent, onChange],
  )

  const displayValue = hoverValue !== null ? hoverValue : value

  const stars = []
  for (let i = 1; i <= 5; i++) {
    const starValue = i
    const difference = displayValue - (i - 1)

    let fillPercentage = 0
    if (difference >= 1) {
      fillPercentage = 100
    } else if (difference > 0) {
      fillPercentage = precision === 0.5 && difference >= 0.5 ? 50 : 0
    }

    stars.push(
      <div
        key={i}
        className="relative inline-block"
        style={{ width: size, height: size }}
      >
        {/* Empty star (background) */}
        <Star
          size={size}
          className={cn(
            'absolute top-0 left-0 text-muted-foreground/30',
            starClassName,
          )}
        />
        {/* Filled star with clip path */}
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <Star
            size={size}
            className={cn('text-yellow-500 fill-yellow-500', starClassName)}
          />
        </div>
      </div>,
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'inline-flex items-center gap-0.5',
        isInteractive && 'cursor-pointer',
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {stars}
    </div>
  )
}
