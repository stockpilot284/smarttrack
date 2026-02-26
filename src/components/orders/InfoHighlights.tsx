import { motion } from 'framer-motion'

export function InfoHighlight({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-md bg-accent border border-border/50 p-4">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="mt-1 text-sm font-semibold text-foreground capitalize">
        {value}
      </div>
    </div>
  )
}

export function InfoRow({
  label,
  value,
  span,
}: {
  label: string
  value: string
  span?: boolean
}) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-4 py-3"
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.01)' }}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium text-foreground ${
          span ? 'sm:col-span-2' : ''
        }`}
      >
        {value}
      </span>
    </motion.div>
  )
}
