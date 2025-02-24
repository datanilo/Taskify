// src/components/Dashboard/SortSheet.tsx
import { Star, Calendar, Sun, ArrowUpDown, Clock } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface SortSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSort: (criteria: string) => void
}

export default function SortSheet({ open, onOpenChange, onSort }: SortSheetProps) {
  const sortOptions = [
    { id: "importance", label: "Importancia", icon: Star },
    { id: "dueDate", label: "Fecha de vencimiento", icon: Calendar },
    { id: "myDay", label: "Añadido a mi día", icon: Sun },
    { id: "alphabetical", label: "Alfabéticamente", icon: ArrowUpDown },
    { id: "creationDate", label: "Fecha de creación", icon: Clock },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[330px]">
        <SheetHeader className="shadow text-center">
          <SheetTitle>Ordenar por</SheetTitle>
        </SheetHeader>
        <div>
          {sortOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              className="w-full justify-start text-sm py-6 font-normal"
              onClick={() => {
                onSort(option.id)
                onOpenChange(false)
              }}
            >
              <option.icon className="mr-2 h-5 w-5" />
              {option.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

