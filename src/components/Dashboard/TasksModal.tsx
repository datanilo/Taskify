import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PenSquare, Trash2 } from "lucide-react";

interface TasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function TasksModal({
  open,
  onOpenChange,
  onRename,
  onDelete,
}: TasksModalProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[110px] overflow-y-auto rounded-t-lg p-0"
      >
        <SheetTitle className="sr-only">Opciones de Lista</SheetTitle>
        <SheetDescription className="sr-only">
          Opciones de lista
        </SheetDescription>
        <div className="flex flex-col divide-y divide-border">
          <button
            onClick={onRename}
            className="flex items-center gap-3 p-4 hover:bg-accent transition-colors focus:outline-none focus:ring-0"
          >
            <PenSquare className="h-5 w-5" />
            <span className="text-sm">Renombrar lista</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-3 p-4 text-destructive hover:bg-destructive/5 transition-colors focus:outline-none focus:ring-0"
          >
            <Trash2 className="h-5 w-5" />
            <span className="text-sm font-medium">Eliminar lista</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
