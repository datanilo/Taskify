import { CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types/types"

interface NotificationCardProps {
  notification: Notification
}

export function NotificationCard({ notification }: NotificationCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-muted/50",
        !notification.read && "bg-muted/30",
      )}
    >
      <div className="flex-1 space-y-1">
        <p className={cn("text-sm font-medium leading-none", !notification.read && "text-primary")}>
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground">{notification.description}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(notification.createdAt).toLocaleDateString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {notification.read && (
        <div className="mt-1 text-muted-foreground">
          <CheckCheck className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

