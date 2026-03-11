import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/SectionHeader'
import { Package, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { motionPresets } from '@/lib/motion-presets'

export function ItemsSection({
  draftItem,
  onDraftChange,
  onAdd,
  items,
  onUpdate,
  onRemove,
  errors,
  disabled = false,
}: any) {
  return (
    <Card>
      <CardHeader>
        <SectionHeader title="Items" icon={Package} />
      </CardHeader>
      <CardContent>
        {/* Draft input row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="w-full flex flex-col md:flex-row md:items-center gap-2 md:w-220">
            <div className="w-full flex flex-col gap-2">
              <Label required>Name</Label>
              <Input
                size="md"
                type="text"
                name="name"
                placeholder="e.g. T-Shirt Polo"
                value={draftItem.name}
                onChange={onDraftChange}
                disabled={disabled}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label required>Quantity</Label>
              <Input
                size="md"
                type="number"
                name="quantity"
                min={1}
                value={draftItem.quantity}
                onChange={onDraftChange}
                disabled={disabled}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label>Description</Label>
              <Input
                size="md"
                name="description"
                value={draftItem.description}
                onChange={onDraftChange}
                placeholder="Optional"
                disabled={disabled}
              />
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={onAdd}
            disabled={!draftItem.name.trim()}
            leftIcon={<Plus size={18} />}
          >
            Add
          </Button>
        </div>

        {errors.items && (
          <span className="text-xs text-destructive mt-2 block">
            {errors.items}
          </span>
        )}

        {/* Items list */}
        {items.length > 0 && (
          <div className="flex flex-col gap-3 mt-6">
            {items.map((item: any, index: number) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row md:justify-between w-full md:items-center gap-6"
                {...motionPresets.fadeSlide}
              >
                <div className="w-full flex-col md:flex-row md:w-220 flex items-center gap-2 bg-gray-100/60 dark:bg-background p-3 rounded-md">
                  <Input
                    size="md"
                    value={item.name}
                    onChange={(e) =>
                      onUpdate(item.name, 'name', e.target.value)
                    }
                  />
                  <Input
                    size="md"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdate(item.name, 'quantity', e.target.value)
                    }
                  />
                  <Input
                    size="md"
                    value={item.description ?? ''}
                    onChange={(e) =>
                      onUpdate(item.name, 'description', e.target.value)
                    }
                  />
                </div>
                <div className="w-full md:w-fit">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onRemove(item.name)}
                    leftIcon={<Trash2 size={18} />}
                    disabled={disabled}
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
