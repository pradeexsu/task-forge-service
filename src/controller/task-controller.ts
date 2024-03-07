import { Request, Response } from 'express'
// import { Builder } from 'builder-pattern'
import {
    deleteTaskById,
    getUserTask,
    saveNewTask,
    updateTask,
} from '../services/task-service.js'

export const createTask = async (request: Request, response: Response) => {
    const userId = response.get('userId')
    const { title, description, status } = request.body

    if (!title || !description || !status) {
        response
            .status(400)
            .json({ message: 'title, description, and status required' })
        return
    }
    const newTask = await saveNewTask(userId, { title, description, status })

    response.status(200).json(newTask)
}
export const getTasks = async (request: Request, response: Response) => {
    const userId = response.get('userId')
    const tasks = await getUserTask(userId)

    response.json({
        success: true,
        data: {
            tasks,
        },
    })

    try {
        // response.json(builder.build())
    } catch (err) {
        // builder
        // .success(false)
        // .errorMessage(`500 Internal Server Error 😶`)
        // response.json(builder.build())
    }
}

//update a task
export const patchTask = async (request: Request, response: Response) => {
    const userId = response.get('userId')
    const { taskId } = request.params

    const { title, description, status } = request.body
    if (!title || !status) {
        response
            .status(400)
            .json({ message: 'title, description, and status required' })
        return
    }
    const updatedTask = updateTask({
        userId,
        id: taskId,
        title,
        description,
        status,
    })

    response.status(200).json({
        data: updatedTask,
        success: true,
        message: 'Task updated successfully',
    })
}

// delete a task
export const deleteTask = async (request: Request, response: Response) => {
    try {
        // const userId = response.get('userId')
        const { taskId } = request.params
        const deletedTask = deleteTaskById(taskId)
        response.status(200).json({
            data: deletedTask,
            success: true,
            message: 'Task deleted successfully',
        })
    } catch (err) {
        response.status(200).json({
            success: false,
            message: 'Failed to delete task',
        })
    }
}
