import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function FormActions({
  onCancel,
  onSubmit,
  isDisabled,
  type = 'CREATE',
}: any) {
  return (
    <Card className="sticky bottom-0 w-full border-t border-primary/10 bg-background/70 backdrop-blur-sm supports-backdrop-filter:bg-background/60 shadow-xs">
      <CardContent className="flex flex-col md:flex-row md:justify-end gap-2 md:px-8">
        <Button variant="outline" size="sm" type="button" onClick={onCancel}>
          Cancel
        </Button>
        {type === 'CREATE' && (
          <Button
            variant="default"
            size="sm"
            type="submit"
            disabled={isDisabled}
            onClick={onSubmit}
          >
            Create Order
          </Button>
        )}
        {type === 'EDIT' && (
          <Button
            variant="default"
            size="sm"
            type="submit"
            disabled={isDisabled}
            onClick={onSubmit}
          >
            Save Order
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
