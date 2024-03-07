export interface ApiResponse<T> {
    errorMessage?: string
    success: boolean
    data?: T
}

export interface Dictionary<T> {
    [Key: string]: T
}
