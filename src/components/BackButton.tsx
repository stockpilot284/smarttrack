import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

interface BackButtonProps {
  fallbackTo: string
  params?: Record<string, string>
}

export function BackButton({ fallbackTo, params }: BackButtonProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate({ to: fallbackTo, params })
    }
  }

  return (
    <Button
      variant="ghost"
      size="iconMd"
      onClick={handleBack}
      className="group"
    >
      <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
    </Button>
  )
}
