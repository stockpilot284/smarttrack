export function avatarClass(name?: string) {
  if (!name) return 'bg-muted text-muted-foreground'

  const c = name.trim().charCodeAt(0) % 6

  const colors = [
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  ]

  return colors[c]
}
