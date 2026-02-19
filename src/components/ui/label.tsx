import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'
import { Asterisk } from 'lucide-react'

type LabelProps = {
  required?: boolean
}

function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-0.5 text-xs leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      {required && <Asterisk size={10} className="text-destructive" />}
    </LabelPrimitive.Root>
  )
}

export { Label }
