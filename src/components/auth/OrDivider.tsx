import { Separator } from '../ui/separator'

export default function OrDivider() {
  return (
    <div className="flex gap-3 py-3 items-center w-full">
      <Separator className="flex-1" />
      <span className="text-xs text-muted-foreground">OR</span>
      <Separator className="flex-1" />
    </div>
  )
}
