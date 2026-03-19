import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface ShareTrackingButtonProps {
  trackingId: string
}

export function ShareTrackingButton({ trackingId }: ShareTrackingButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/track/${trackingId}`
    await navigator.clipboard.writeText(url)
    toast.success('Tracking link copied to clipboard')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      leftIcon={<Share2 className="h-4 w-4" />}
    >
      Share
    </Button>
  )
}
