import { LucideIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { motionPresets } from '@/lib/motion-presets'

type KpiItem = {
  label: string
  value: string | Date | undefined
  Icon: LucideIcon
}
type Props = {
  kpis: KpiItem[]
}

export default function OrderKpiOverview({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1 gap-4">
      {kpis.map((item) => (
        <motion.div {...motionPresets.inViewFadeUp}>
          <Card key={item.label}>
            <CardContent className=" flex items-start justify-between">
              <CardHeader className="flex flex-col gap-2 p-0 flex-1">
                {/* Label */}
                <Label className="text-[13px] font-medium text-muted-foreground ">
                  {item.label}
                </Label>

                {/*  Value */}
                <CardTitle className="text-base font-medium text-foreground capitalize">
                  {item.value?.toString().toLowerCase()}
                </CardTitle>
              </CardHeader>

              <CardDescription
                className={`w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-foreground`}
              >
                {<item.Icon size={24} />}
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
