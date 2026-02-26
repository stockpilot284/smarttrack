import { motionPresets } from '@/lib/motion-presets'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useEffect, useState } from 'react'

type User = {
  id: string
  name: string
  email: string
}

export default function AddDriver() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Replace with your real API call
    const fetchUsers = async () => {
      const res = await fetch('/api/users?role=USER')
      const data = await res.json()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  const handleAssignDriver = async () => {
    if (!selectedUserId) return

    setLoading(true)

    await fetch('/api/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserId }),
    })

    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div {...motionPresets.inViewFadeUp}>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            className="w-full md:w-fit"
          >
            Add Driver
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Driver</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-full" size="sm">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>

            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            onClick={handleAssignDriver}
            disabled={!selectedUserId || loading}
            size={'sm'}
            loading={loading}
          >
            {loading ? 'Adding...' : 'Add Driver'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
