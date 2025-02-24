// src/hooks/useTasks.ts
import { useState, useEffect } from "react";
import type { Task, List, SharedList } from "@/types/types";
import { useUserContext } from "@/auth/contexts/useUserContext";

const useTasks = (onSharedListSelect?: (list: SharedList) => void) => {
  const { user, setUser } = useUserContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [sharedLists, setSharedLists] = useState<SharedList[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [currentList, setCurrentList] = useState<List | SharedList | null>(null);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setCompletedTasks([]);
      setLists([]);
      setSharedLists([]);
      setCurrentList(null);
      setInitialLoad(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setCompletedTasks([]);
      setLists([]);
      setSharedLists([]);
      setCurrentList(null);
      setInitialLoad(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user && !initialLoad) {
      const hasLocalTasks =
        (user.lists && user.lists.some(list => list.tasks && list.tasks.length > 0)) ||
        (user.sharedLists && user.sharedLists.some(list => list.tasks && list.tasks.length > 0));
      if (hasLocalTasks) {
        setLists(user.lists || []);
        setSharedLists(user.sharedLists || []);
        const initialList =
          (user.lists && user.lists.length > 0)
            ? user.lists[0]
            : (user.sharedLists && user.sharedLists.length > 0)
              ? user.sharedLists[0]
              : null;
        setCurrentList(initialList);
        if (initialList) {
          const listTasks = initialList.tasks || [];
          setTasks(listTasks.filter((task: Task) => !task.completed));
          setCompletedTasks(listTasks.filter((task: Task) => task.completed));
        }
        setInitialLoad(true);
      }
    }
  }, [user, initialLoad]);

  const handleSort = (criteria: string) => {
    const sortedTasks = [...tasks];
    switch (criteria) {
      case "importance":
        sortedTasks.sort((a, b) => Number(b.starred) - Number(a.starred));
        break;
      case "dueDate":
        sortedTasks.sort(
          (a, b) =>
            new Date(a.dueDate || "").getTime() - new Date(b.dueDate || "").getTime()
        );
        break;
      case "myDay":
        sortedTasks.sort((a, b) => Number(b.addedToMyDay) - Number(a.addedToMyDay));
        break;
      case "alphabetical":
        sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "creationDate":
        sortedTasks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }
    setTasks(sortedTasks);
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        starred: false,
        createdAt: new Date().toISOString(),
        addedToMyDay: true,
      };

      setTasks((prev) => [...prev, newTaskObj]);

      if (currentList) {
        if ("sharedWith" in currentList) {
          const updatedSharedLists = sharedLists.map((list) =>
            list.id === currentList.id
              ? { ...list, tasks: [...(list.tasks || []), newTaskObj] }
              : list
          );
          setSharedLists(updatedSharedLists);
          if (user && user.sharedLists) {
            const updatedUserSharedLists = user.sharedLists.map((list: SharedList) =>
              list.id === currentList.id
                ? { ...list, tasks: [...(list.tasks || []), newTaskObj] }
                : list
            );
            setUser({ ...user, sharedLists: updatedUserSharedLists });
          }
        } else {
          const updatedLists = lists.map((list) =>
            list.id === currentList.id
              ? { ...list, tasks: [...(list.tasks || []), newTaskObj] }
              : list
          );
          setLists(updatedLists);
          if (user && user.lists) {
            const updatedUserLists = user.lists.map((list: List) =>
              list.id === currentList.id
                ? { ...list, tasks: [...(list.tasks || []), newTaskObj] }
                : list
            );
            setUser({ ...user, lists: updatedUserLists });
          }
        }
      }

      setNewTask("");
      setShowNewTask(false);
    }
  };

  const handleTaskSelection = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks((prev) => [...prev, taskId]);
    } else {
      setSelectedTasks((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const completeSelectedTasks = () => {
    const tasksToComplete = tasks.filter((task) => selectedTasks.includes(task.id));
    const updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.id));

    const newCompletedTasks = tasksToComplete.map((task) => ({
      ...task,
      completed: true,
    }));

    setTasks(updatedTasks);
    setCompletedTasks((prev) => [...prev, ...newCompletedTasks]);
    setSelectedTasks([]);

    if (currentList) {
      const updatedListTasks = [...updatedTasks, ...newCompletedTasks, ...completedTasks];
      if ("sharedWith" in currentList) {
        const updatedSharedLists = sharedLists.map((list) =>
          list.id === currentList.id ? { ...list, tasks: updatedListTasks } : list
        );
        setSharedLists(updatedSharedLists);
        if (user && user.sharedLists) {
          const updatedUserSharedLists = user.sharedLists.map((list: SharedList) =>
            list.id === currentList.id ? { ...list, tasks: updatedListTasks } : list
          );
          setUser({ ...user, sharedLists: updatedUserSharedLists });
        }
      } else {
        const updatedLists = lists.map((list) =>
          list.id === currentList.id ? { ...list, tasks: updatedListTasks } : list
        );
        setLists(updatedLists);
        if (user && user.lists) {
          const updatedUserLists = user.lists.map((list: List) =>
            list.id === currentList.id ? { ...list, tasks: updatedListTasks } : list
          );
          setUser({ ...user, lists: updatedUserLists });
        }
      }
    }
  };

  const handleListSelect = (list: List | SharedList) => {
    setCurrentList(list);
    if ("sharedWith" in list) {
      onSharedListSelect?.(list);
    }
    const listTasks = list.tasks || [];
    setTasks(listTasks.filter((task) => !task.completed));
    setCompletedTasks(listTasks.filter((task) => task.completed));
  };

  const renameList = (newName: string) => {
    if (!currentList) return;
    if ("sharedWith" in currentList) {
      const updatedList: SharedList = { ...currentList, name: newName };
      const updatedSharedLists = sharedLists.map(list =>
        list.id === currentList.id ? updatedList : list
      );
      setSharedLists(updatedSharedLists);
      if (user && user.sharedLists) {
        const updatedUserSharedLists = user.sharedLists.map(list =>
          list.id === currentList.id ? updatedList : list
        );
        setUser({ ...user, sharedLists: updatedUserSharedLists });
      }
      setCurrentList(updatedList);
    } else {
      const updatedList: List = { ...currentList, name: newName };
      const updatedLists = lists.map(list =>
        list.id === currentList.id ? updatedList : list
      );
      setLists(updatedLists);
      if (user && user.lists) {
        const updatedUserLists = user.lists.map(list =>
          list.id === currentList.id ? updatedList : list
        );
        setUser({ ...user, lists: updatedUserLists });
      }
      setCurrentList(updatedList);
    }
  };

  // Actualización en deleteList: se limpian los estados de tasks y completedTasks,
  // y se selecciona la primera lista disponible o se asigna la lista por defecto "Tareas"
  const deleteList = () => {
    if (!currentList) return;
    if ("sharedWith" in currentList) {
      const updatedSharedLists = sharedLists.filter(list => list.id !== currentList.id);
      setSharedLists(updatedSharedLists);
      if (user && user.sharedLists) {
        const updatedUserSharedLists = user.sharedLists.filter(list => list.id !== currentList.id);
        setUser({ ...user, sharedLists: updatedUserSharedLists });
      }
      if (updatedSharedLists.length > 0) {
        setCurrentList(updatedSharedLists[0]);
        const listTasks = updatedSharedLists[0].tasks || [];
        setTasks(listTasks.filter((task: Task) => !task.completed));
        setCompletedTasks(listTasks.filter((task: Task) => task.completed));
      } else {
        // Si no hay listas compartidas, asignar la lista por defecto "Tareas"
        const defaultList = { id: "tareas", name: "Tareas", tasks: [] };
        setCurrentList(defaultList);
        setTasks([]);
        setCompletedTasks([]);
      }
    } else {
      const updatedLists = lists.filter(list => list.id !== currentList.id);
      setLists(updatedLists);
      if (user && user.lists) {
        const updatedUserLists = user.lists.filter(list => list.id !== currentList.id);
        setUser({ ...user, lists: updatedUserLists });
      }
      if (updatedLists.length > 0) {
        setCurrentList(updatedLists[0]);
        const listTasks = updatedLists[0].tasks || [];
        setTasks(listTasks.filter((task: Task) => !task.completed));
        setCompletedTasks(listTasks.filter((task: Task) => task.completed));
      } else {
        const defaultList = { id: "tareas", name: "Tareas", tasks: [] };
        setCurrentList(defaultList);
        setTasks([]);
        setCompletedTasks([]);
      }
    }
  };

  // Función para crear una nueva lista
  const createList = (name: string) => {
    const newList: List = {
      id: Date.now().toString(),
      name,
      tasks: [],
    };
    const updatedLists = [...lists, newList];
    setLists(updatedLists);
    if (user && user.lists) {
      const updatedUserLists = [...user.lists, newList];
      setUser({ ...user, lists: updatedUserLists });
    }
    setCurrentList(newList);
    return newList;
  };

  return {
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
    setSelectedTasks,
    setIsCompletedExpanded,
    handleSort,
    addTask,
    handleTaskSelection,
    completeSelectedTasks,
    handleListSelect,
    renameList,
    deleteList,
    createList,
  };
};

export default useTasks;
