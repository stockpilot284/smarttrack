import { Bell, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'

// Alert types based on your specification
export type AlertSource =
  | 'SYSTEM'
  | 'DRIVER'
  | 'ADMIN'
  | 'CUSTOMER'
  | 'INTEGRATION'
export type AlertCategory =
  | 'DRIVER'
  | 'ORDER'
  | 'VEHICLE'
  | 'TRACKING'
  | 'SYSTEM'
  | 'SECURITY'
  | 'BILLING'
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL'
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED'

export interface Alert {
  id: string
  source: AlertSource
  category: AlertCategory
  severity: AlertSeverity
  status: AlertStatus
  title: string
  message: string
  acknowledgedAt?: string | null
  acknowledgedBy?: string | null
  resolvedBy?: string | null
  resolutionNote?: string | null
  createdAt: string | Date
  updatedAt: string | Date
}

interface NotificationBellProps {
  alerts: Alert[]
  onAcknowledge: (alertId: string) => void
  onAcknowledgeAll?: () => void
  onViewAll: () => void
  isLoading?: boolean
}

// Helper to get severity icon and color
const severityConfig = {
  INFO: { icon: Info, className: 'text-blue-500', bg: 'bg-blue-500/10' },
  WARNING: {
    icon: AlertCircle,
    className: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  CRITICAL: { icon: XCircle, className: 'text-red-500', bg: 'bg-red-500/10' },
}

export function NotificationBell({
  alerts,
  onAcknowledge,
  onAcknowledgeAll,
  onViewAll,
  isLoading,
}: NotificationBellProps) {
  // Unread alerts are those with status 'OPEN'
  const unreadAlerts = alerts.filter((a) => a.status === 'OPEN')
  const unreadCount = unreadAlerts.length

  // Show latest 5 alerts, sorted by createdAt descending
  const displayAlerts = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="iconMd"
          className="relative border border-border/40 dark:border-border"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 dark:border-border">
          <h4 className="font-medium text-sm">Notifications</h4>
          {onAcknowledgeAll && unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={onAcknowledgeAll}
            >
              Acknowledge all
            </Button>
          )}
        </div>

        <ScrollArea className="h-[350px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <Spinner size="sm" />
            </div>
          ) : displayAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-20 px-4 text-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="py-2">
              {displayAlerts.map((alert, index) => {
                const SeverityIcon = severityConfig[alert.severity].icon
                const isUnread = alert.status === 'OPEN'

                return (
                  <div key={alert.id}>
                    <div
                      className={cn(
                        'px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer',
                        isUnread && 'bg-muted/30',
                      )}
                      onClick={() => {
                        if (isUnread) onAcknowledge(alert.id)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Severity icon */}
                        <SeverityIcon
                          className={cn(
                            'h-4 w-4 mt-0.5',
                            severityConfig[alert.severity].className,
                          )}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {isUnread && (
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                              )}
                              <p
                                className={cn(
                                  'text-sm font-medium',
                                  isUnread
                                    ? 'text-foreground'
                                    : 'text-muted-foreground',
                                )}
                              >
                                {alert.title}
                              </p>
                            </div>
                            {/* Source badge */}
                            <Badge
                              variant="outline"
                              className="text-[8px] px-1 py-0 h-4 capitalize"
                            >
                              {alert.source.toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>
                              {formatDistanceToNow(new Date(alert.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                            <span className="capitalize">
                              {alert.category.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < displayAlerts.length - 1 && <Separator />}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2 border-border/40 dark:border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs"
            onClick={onViewAll}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
