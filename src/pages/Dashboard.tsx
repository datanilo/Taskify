import {
  ArrowUpDown,
  Plus,
  Calendar,
  Bell,
  Repeat,
  Check,
  X,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import SortSheet from "@/components/Dashboard/SortSheet";
import type { SharedList } from "@/types/types";
import useTasks from "@/hooks/useTasks";
import TaskList from "@/components/Dashboard/TaskList";
import { useState } from "react";
import TasksModal from "@/components/Dashboard/TasksModal";
import ConfirmDeleteDialog from "@/components/Dashboard/ConfirmDeleteDialog";

interface DashboardProps {
  onSharedListSelect?: (list: SharedList) => void;
}

export default function Dashboard({ onSharedListSelect }: DashboardProps) {
  const {
    tasks,
    completedTasks,
    lists,
    sharedLists,
    newTask,
    showNewTask,
    showSortSheet,
    selectedTasks,
    currentList,
    isCompletedExpanded,
    setNewTask,
    setShowNewTask,
    setShowSortSheet,
    setIsCompletedExpanded,
    handleSort,
    addTask,
    handleTaskSelection,
    completeSelectedTasks,
    handleListSelect,
    renameList,
    deleteList,
    createList,
  } = useTasks(onSharedListSelect);

  const [showTasksModal, setShowTasksModal] = useState(false);
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleRenameList = () => {
    if (currentList) {
      setNewListName(currentList.name);
      setIsEditingListName(true);
    }
    setShowTasksModal(false);
  };

  const handleDeleteList = () => {
    setShowConfirmDelete(true);
    setShowTasksModal(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b px-2 h-14 flex items-center gap-2">
        <Sidebar
          lists={lists}
          sharedLists={sharedLists}
          onListSelect={handleListSelect}
          onCreateList={createList}
        />
        <div className="flex items-center gap-2">
          {isEditingListName ? (
            <Input
              ref={(input) => { if (input) input.focus(); }}
              autoFocus
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onBlur={() => {
                if (newListName.trim() !== "") {
                  renameList(newListName);
                }
                setIsEditingListName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  renameList(newListName);
                  setIsEditingListName(false);
                }
              }}
              className="text-blue-600 text-lg font-semibold"
            />
          ) : (
            <h2 className="text-blue-600 text-lg font-semibold">
              {currentList ? currentList.name : "Tareas"}
            </h2>
          )}
          {currentList &&
            currentList.id !== "1" && // NO mostrar el botón de opciones para la lista con id "1"
            !isEditingListName && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTasksModal(true)}
                className="hover:bg-gray-100 justify-start"
              >
                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            )}
        </div>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={() => setShowSortSheet(true)}
          >
            <ArrowUpDown className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <SortSheet
        open={showSortSheet}
        onOpenChange={setShowSortSheet}
        onSort={handleSort}
      />

      <div className="flex-1 px-4 overflow-auto mt-5">
        {showNewTask ? (
          <Card className="overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className="h-5 w-5 aspect-square flex-shrink-0 rounded-full border border-gray-400" />
              <Input
                type="text"
                placeholder="Nueva Tarea"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="border-0 shadow-none p-0 focus-visible:ring-0 focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
            </div>
            <div className="border-t p-2 flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={addTask} className="bg-blue-600 hover:bg-blue-700 text-white">
                Agregar
              </Button>
            </div>
          </Card>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 py-7 text-blue-600 hover:bg-gray-50 bg-card rounded border shadow-sm"
            onClick={() => setShowNewTask(true)}
          >
            <Plus className="h-5 w-5 ml-2" />
            <span>Agregar una tarea</span>
          </Button>
        )}

        <TaskList
          tasks={tasks}
          completedTasks={completedTasks}
          selectedTasks={selectedTasks}
          handleTaskSelection={handleTaskSelection}
          isCompletedExpanded={isCompletedExpanded}
          setIsCompletedExpanded={setIsCompletedExpanded}
        />
      </div>

      <Button
        size="icon"
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg ${
          selectedTasks.length > 0
            ? "bg-[#28A745] hover:bg-[#218838]"
            : showNewTask
            ? "bg-[#E63946] hover:bg-[#CF333F]"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
        onClick={() => {
          if (selectedTasks.length > 0) {
            completeSelectedTasks();
          } else if (showNewTask) {
            setShowNewTask(false);
            setNewTask("");
          } else {
            setShowNewTask(true);
          }
        }}
      >
        {selectedTasks.length > 0 ? (
          <Check className="h-6 w-6" />
        ) : showNewTask ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>

      <TasksModal
        open={showTasksModal}
        onOpenChange={setShowTasksModal}
        onRename={handleRenameList}
        onDelete={handleDeleteList}
      />

      <ConfirmDeleteDialog
        open={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        onConfirm={deleteList}
      />
    </div>
  );
}
