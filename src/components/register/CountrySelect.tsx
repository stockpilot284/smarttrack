import { useMemo, useState } from 'react'
import countryList from 'react-select-country-list'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { AnimatePresence, motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

type CountrySelectProps = {
  value: string
  onValueChange: (value: string) => void
  error?: string
  onBlur?: () => void
}

export function CountrySelect({
  value,
  onValueChange,
  error,
  onBlur,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const options = useMemo(() => countryList().getData(), [])

  return (
    <div className="flex flex-col gap-2 w-full">
      <Popover
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open && onBlur) onBlur() // trigger blur when popover closes
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size={'md'}
            aria-expanded={open}
            rightIcon={
              <ChevronsUpDown className="ml-2 shrink-0 opacity-50" size={18} />
            }
            className={cn(
              'w-full justify-between bg-transparent dark:bg-input/30 dark:hover:bg-input/50',
              error && 'border-red-500 focus:ring-red-500 dark:border-red-400',
              value ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {value
              ? options.find((country) => country.label === value)?.label
              : 'Select country...'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.label}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === country.label ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {country.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <AnimatePresence mode="wait">
        {error && (
          <motion.span
            className="text-xs text-destructive"
            {...motionPresets.fade}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
