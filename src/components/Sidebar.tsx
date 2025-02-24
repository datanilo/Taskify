import { useState, useRef } from "react";
import { Menu, Sun, Calendar, ChevronDown, ChevronRight, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { List, SharedList } from "@/types/types";

interface SidebarProps {
  lists: List[];
  sharedLists: SharedList[];
  onListSelect: (list: List | SharedList) => void;
  onCreateList: (name: string) => List;
}

export default function Sidebar({ lists, sharedLists, onListSelect, onCreateList }: SidebarProps) {
  const [isSharedListsOpen, setIsSharedListsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // Valor inicial para mostrar el placeholder "Nueva Lista"
  const [newListName, setNewListName] = useState("Nueva Lista");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectList = (list: List | SharedList) => {
    onListSelect(list);
    setOpen(false);
  };

  const handleCreateList = () => {
    if (newListName.trim() !== "" && newListName !== "Nueva Lista") {
      const createdList = onCreateList(newListName.trim());
      onListSelect(createdList);
    }
    setIsEditing(false);
    setNewListName("Nueva Lista");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetDescription className="sr-only">Información del usuario</SheetDescription>
        <SheetHeader className="shadow">
          <SheetTitle>Listas</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          {/* Primer grupo de listas fijas */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelectList({ id: "hoy", name: "Hoy", tasks: [] })}
            >
              <Sun className="mr-2 h-4 w-4" />
              Hoy
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelectList({ id: "favoritos", name: "Favoritos", tasks: [] })}
            >
              <Star className="mr-2 h-4 w-4" />
              Favoritos
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelectList({ id: "esta-semana", name: "Esta semana", tasks: [] })}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Esta semana
            </Button>
          </div>
          {/* Grupo de listas del usuario + opción de "Nueva Lista" integrada */}
          <div className="space-y-2 mt-4">
            {lists.length === 0 ? (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSelectList({ id: "tareas", name: "Tareas", tasks: [] })}
              >
                Tareas
              </Button>
            ) : (
              lists.map((list) => (
                <Button
                  key={list.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelectList(list)}
                >
                  {list.name}
                </Button>
              ))
            )}
            {/* Opción "Nueva Lista" integrada al grupo */}
            <div className="flex items-center gap-2 px-4 shadow-none focus:outline-none focus:ring-0">
              <Plus className="h-4 w-4 text-blue-600" />
              <Input
                ref={inputRef}
                value={newListName}
                readOnly={!isEditing}
                onClick={() => {
                  if (!isEditing) {
                    setIsEditing(true);
                    setNewListName("");
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 0);
                  }
                }}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateList();
                  }
                }}
                onBlur={() => {
                  if (newListName.trim() === "") {
                    setNewListName("Nueva Lista");
                    setIsEditing(false);
                  } else {
                    handleCreateList();
                  }
                }}
                className="text-blue-600 bg-transparent border-none shadow-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <Separator className="my-4" />
          {/* Sección de listas compartidas */}
          <Collapsible open={isSharedListsOpen} onOpenChange={setIsSharedListsOpen} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center">
                  {isSharedListsOpen ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                  Listas compartidas
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {sharedLists.map((list) => (
                <Button
                  key={list.id}
                  variant="ghost"
                  className="w-full justify-start pl-8"
                  onClick={() => handleSelectList(list)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={list.sharedWith.avatarUrl} />
                      <AvatarFallback>{list.sharedWith.name[0]}</AvatarFallback>
                    </Avatar>
                    {list.name}
                  </div>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </SheetContent>
    </Sheet>
  );
}
