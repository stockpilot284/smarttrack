import { animate, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useCountUp(value: number, duration = 1.2) {
  const motionValue = useMotionValue(0)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest))
      },
    })

    return controls.stop
  }, [value])

  return displayValue
}
