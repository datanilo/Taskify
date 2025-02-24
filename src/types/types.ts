export interface Task {
  id: string
  title: string
  completed: boolean
  starred: boolean
  list?: string
  dueDate?: Date
  reminder?: Date
  repeat?: boolean
  createdAt: string
  addedToMyDay?: boolean
}

export interface List {
  id: string
  name: string
  tasks?: Task[]
}

export interface SharedList extends List {
  sharedWith: User
}

export interface Notification {
  id: string
  title: string
  description: string
  createdAt: string
  message: string
  read: boolean
  timestamp: string
}

export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string
  lists?: List[]
  sharedLists?: SharedList[]
  notifications?: Notification[]
}

