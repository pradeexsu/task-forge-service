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
