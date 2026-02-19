import { Link } from '@tanstack/react-router'
import { ArrowRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'
import SectionHeaderSkeleton from '@/components/skeletons/SectionHeaderSkeleton'
type SectionHeaderProps = {
  title: string
  description?: string
  icon?: LucideIcon
  actionLabel?: string
  actionTo?: string
  actionParams?: Record<string, string>
  className?: string
  iconColor?: string
  isLoading?: boolean
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionTo,
  actionParams,
  className,
  iconColor,
  isLoading,
}: SectionHeaderProps) {
  if (isLoading) return <SectionHeaderSkeleton />
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* Left */}
      <div
        className={`flex gap-3 ${!description && title && Icon ? 'items-center' : 'items-start'}`}
      >
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            {Icon && (
              <Icon className={cn(' text-foreground', iconColor)} size={20} />
            )}
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px]  font-medium tracking-tight">{title}</h2>
          {description && (
            <motion.p
              className="text-xs text-muted-foreground"
              {...motionPresets.fade}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Right Action */}
      {actionTo && actionLabel && (
        <Link
          to={actionTo}
          params={actionParams}
          className="group text-xs text-primary flex items-center gap-0.5 hover:text-primary/70 transition-colors px-0.5"
        >
          {actionLabel}{' '}
          <ArrowRight
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  )
}
