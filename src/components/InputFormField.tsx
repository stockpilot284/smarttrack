import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type FormFieldProps = {
  label: string
  helperText?: string
  error?: string
  inputProps?: React.ComponentProps<typeof Input>
}

export default function InputFormField({
  label,
  helperText,
  error,
  inputProps,
}: FormFieldProps) {
  const id = React.useId()

  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      <Input
        id={id}
        {...inputProps}
        className={cn(
          'w-full',
          error && 'border-destructive focus-visible:ring-destructive',
          inputProps?.className,
        )}
      />

      {(helperText || error) && (
        <p
          className={cn(
            'text-xs',
            error ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  )
}
