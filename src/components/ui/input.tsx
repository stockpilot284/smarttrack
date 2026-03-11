import * as React from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type InputSize = 'sm' | 'md' | 'lg'

const inputSizeStyles: Record<
  InputSize,
  {
    input: string
    searchIcon: string
    passwordButton: string
    iconSize: string
  }
> = {
  sm: {
    input: 'h-8 px-3 text-xs',
    searchIcon: 'left-3',
    passwordButton: 'h-7 w-7 right-1.5',
    iconSize: 'h-4 w-4',
  },
  md: {
    input: 'h-9 px-3.5 text-sm',
    searchIcon: 'left-3.5',
    passwordButton: 'h-8 w-8 right-2',
    iconSize: 'h-4 w-4',
  },
  lg: {
    input: 'h-11 px-4 text-base',
    searchIcon: 'left-4',
    passwordButton: 'h-9 w-9 right-2.5',
    iconSize: 'h-5 w-5',
  },
}

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  size?: InputSize
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', size = 'md', ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const isPassword = type === 'password'
    const isSearch = type === 'search'

    const styles = inputSizeStyles[size]

    // Autofill styles: light yellow background + black text for light mode,
    // dark gray background + white text for dark mode.
    const autofillClasses = [
      // Light mode autofill (WebKit)
      '[&:-webkit-autofill]:shadow-[inset_0_0_0_100px_#f3e8ff]',
      '[&:-webkit-autofill]:[-webkit-text-fill-color:#000]',
      // Dark mode autofill (WebKit)
      'dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_100px_rgb(55,65,81)]',
      'dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#fff]',
      // Light mode autofill (standard, for Firefox)
      '[&:autofill]:shadow-[inset_0_0_0_100px_#f3e8ff]',
      '[&:autofill]:[-webkit-text-fill-color:#000]',
      // Dark mode autofill (standard)
      'dark:[&:autofill]:shadow-[inset_0_0_0_100px_rgb(55,65,81)]',
      'dark:[&:autofill]:[-webkit-text-fill-color:#fff]',
    ].join(' ')
    return (
      <div className="relative w-full">
        {/* Search icon (left) */}
        {isSearch && (
          <Search
            className={cn(
              'absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none',
              styles.searchIcon,
              styles.iconSize,
            )}
          />
        )}

        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          data-slot="input"
          className={cn(
            'w-full rounded-md border border-border/40 dark:border-border bg-transparent font-normal text-foreground transition-colors outline-none placeholder:text-placeholder',
            'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 transition-all',
            'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/70',
            'disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50',
            styles.input,
            isPassword && 'pr-10',
            isSearch && 'pl-9',
            autofillClasses, // Add autofill styles
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
            className={cn(
              'absolute top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus:outline-none',
              styles.passwordButton,
            )}
          >
            {showPassword ? (
              <EyeOff className={styles.iconSize} />
            ) : (
              <Eye className={styles.iconSize} />
            )}
          </button>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
