import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { LogOut, PenSquare, Moon } from "lucide-react"

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: { name: string; email: string; avatarUrl: string }
  handleLogout: () => void
  isDarkMode?: boolean
  onDarkModeChange?: (enabled: boolean) => void
}

export default function UserModal({
  open,
  onOpenChange,
  user,
  handleLogout,
  isDarkMode = false,
  onDarkModeChange,
}: UserModalProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      
      <SheetContent side="bottom" className="h-[265px] overflow-y-auto rounded-t-lg p-0">

        <SheetTitle className="sr-only">Información del usuario</SheetTitle>
        <SheetDescription className="sr-only">Información del usuario</SheetDescription>

        <div className="flex flex-col divide-y divide-border">
          <div className="flex items-center gap-3 p-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user.avatarUrl} alt={user.name} className="h-full w-full" />
              <AvatarFallback className="text-lg">{user.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.email}</span>
            </div>
          </div>

          <div className="flex flex-col">

            <button className="flex items-center gap-3 p-4 mt-2 hover:bg-accent transition-colors focus:outline-none focus:ring-0">
              <PenSquare className="h-5 w-5" />
              <span className="text-sm">Editar Avatar</span>
            </button>

            <div className="flex items-center justify-between p-4 mb-2 hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5" />
                <span className="text-sm">Modo Oscuro</span>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onDarkModeChange} />
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-6 text-destructive hover:bg-destructive/5 transition-colors border-t focus:outline-none focus:ring-0"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

