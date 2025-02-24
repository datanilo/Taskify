// src/components/Dashboard/TaskList.tsx
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Star, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Task } from "@/types/types"

interface TaskListProps {
  tasks: Task[]
  completedTasks: Task[]
  selectedTasks: string[]
  handleTaskSelection: (taskId: string, checked: boolean) => void
  isCompletedExpanded: boolean
  setIsCompletedExpanded: (expanded: boolean) => void
}

const TaskList = ({
  tasks,
  completedTasks,
  selectedTasks,
  handleTaskSelection,
  isCompletedExpanded,
  setIsCompletedExpanded,
}: TaskListProps) => {
  return (
    <>
      <div className="space-y-2 mt-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:bg-blue-50">
            <div className="flex items-center gap-3 p-4">
              <Checkbox
                checked={selectedTasks.includes(task.id)}
                onCheckedChange={(checked) => handleTaskSelection(task.id, checked as boolean)}
                className="h-5 w-5 rounded-full data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <div className="flex-1">
                <div className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {completedTasks.length > 0 && (
        <Collapsible open={isCompletedExpanded} onOpenChange={setIsCompletedExpanded} className="my-6">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full text-sm justify-between text-gray-600">
              <span className="flex items-center gap-2">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isCompletedExpanded ? "" : "-rotate-90"
                  }`}
                />
                Tareas hechas ({completedTasks.length})
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mb-2 rounded-lg">
            {completedTasks.map((task) => (
              <Card key={task.id} className="hover:bg-blue-50">
                <div className="flex items-center gap-3 p-3">
                  <Checkbox
                    checked={true}
                    className="h-5 w-5 rounded-full data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium line-through text-gray-400">{task.title}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <Star className={`h-5 w-5 ${task.starred ? "fill-yellow-400" : ""}`} />
                  </Button>
                </div>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  )
}

export default TaskList
