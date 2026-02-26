// components/data-loader.tsx
import * as React from 'react'
import { Spinner } from '@/components/Spinner'
import { cn } from '@/lib/utils'

type DataLoaderProps = {
  isLoading: boolean
  children?: React.ReactNode
  fullPage?: boolean
  spinnerSize?: 'sm' | 'md' | 'lg'
  spinnerColor?: string
  className?: string
}

export function DataLoader({
  isLoading,
  children,
  fullPage = false,
  spinnerSize = 'md',
  spinnerColor = '#2563eb',
  className,
}: DataLoaderProps) {
  if (!isLoading) {
    return <>{children}</>
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullPage && 'h-full w-full',
        className,
      )}
    >
      <Spinner size={spinnerSize} color={spinnerColor} />
    </div>
  )
}
