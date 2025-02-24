// src/components/Navbar/NotificationsDropdown.tsx
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotificationCard } from "@/components/Navbar/NotificationCard"
import type { Notification } from "@/types/types";
import { useState } from "react";

interface NotificationsDropdownProps {
  notifications: Notification[];
  markAllAsRead: () => void;
}

export default function NotificationsDropdown({ notifications, markAllAsRead }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40"></div>}
      <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative text-white hover:bg-white/20">
            <Bell className="h-4 w-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-900 text-[8px] text-primary-foreground">
                {unreadNotifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-76 p-0 z-50" align="end">
          <Card className="border-none shadow-none">
            <CardHeader className="border-b space-y-0 px-4 py-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">Notificaciones</p>
                {unreadNotifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-6 text-[11px] px-2 hover:text-primary"
                  >
                    Marcar como leídas
                  </Button>
                )}
              </div>
              {unreadNotifications.length > 0 && (
                <p className="text-[11px] text-muted-foreground">{unreadNotifications.length} sin leer</p>
              )}
            </CardHeader>
            <Tabs defaultValue="unread" className="w-full">
              <div className="border-b px-2">
                <TabsList className="grid h-8 w-full grid-cols-2">
                  <TabsTrigger value="unread" className="text-xs">
                    No leídas
                  </TabsTrigger>
                  <TabsTrigger value="read" className="text-xs">
                    Anteriores
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardContent className="overflow-y-auto p-0">
                <TabsContent value="unread" className="m-0">
                  {unreadNotifications.length === 0 ? (
                    <div className="flex h-24 items-center justify-center">
                      <p className="text-xs text-muted-foreground">No hay notificaciones sin leer</p>
                    </div>
                  ) : (
                    <div className="grid gap-0.5 py-1">
                      {unreadNotifications.map((notification) => (
                        <NotificationCard key={notification.id} notification={notification} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="read" className="m-0">
                  {readNotifications.length === 0 ? (
                    <div className="flex h-24 items-center justify-center">
                      <p className="text-xs text-muted-foreground">No hay notificaciones anteriores</p>
                    </div>
                  ) : (
                    <div className="grid gap-0.5 py-1">
                      {readNotifications.map((notification) => (
                        <NotificationCard key={notification.id} notification={notification} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}