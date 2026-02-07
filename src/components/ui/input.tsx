import * as React from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  const [showPassword, setShowPassword] = React.useState(false)

  const isPassword = type === 'password'
  const isSearch = type === 'search'

  return (
    <div
      className={cn(
        'relative',
        (isPassword || isSearch) && 'flex items-center',
      )}
    >
      {/* Search icon (left) */}
      {isSearch && (
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      )}

      <input
        type={isPassword && showPassword ? 'text' : type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-placeholder placeholder:text-sm placeholder:font-normal selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-border h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-normal text-foreground',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          isPassword && 'pr-10',
          isSearch && 'pl-9',
          className,
        )}
        {...props}
      />

      {/* Password toggle (right) */}
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  )
}

export { Input }
