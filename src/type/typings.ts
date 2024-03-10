import { Task } from '@prisma/client'

export interface ApiResponse<T> {
    message?: string
    success: boolean
    data?: T
}

export interface Dictionary<T> {
    [Key: string]: T
}

export type AuthRequest = {
    username?: string
    email: string
    password: string
    id?: string
}

export type AuthResponse = Omit<AuthRequest, 'password'>

export type RequestQuery = {
    userId: string
    requestId: string
}

export type TaskDto = Partial<Task>
export type TaskListData = {
    taskList: TaskDto[]
}
