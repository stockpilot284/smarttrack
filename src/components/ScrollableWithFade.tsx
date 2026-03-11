// components/ui/scrollable-with-fade.tsx
import { cn } from '@/lib/utils'
import React from 'react'

interface ScrollableWithFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  heightClass?: string
  gradientHeight?: string
  children: React.ReactNode
}

export function ScrollableWithFade({
  children,
  className,
  heightClass = 'h-[300px] lg:h-[400px]',
  gradientHeight = 'h-8',
  ...props
}: ScrollableWithFadeProps) {
  return (
    <div className={cn('relative', className)} {...props}>
      {/* Top fade gradient */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 pointer-events-none z-10',
          gradientHeight,
          'bg-gradient-to-b from-card to-transparent',
        )}
      />

      {/* Scrollable content */}
      <div className={cn('overflow-y-auto no-scrollbar', heightClass)}>
        {children}
      </div>

      {/* Bottom fade gradient */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 pointer-events-none z-10',
          gradientHeight,
          'bg-gradient-to-t from-card to-transparent',
        )}
      />
    </div>
  )
}
