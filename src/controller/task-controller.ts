import { Request, Response } from 'express'
import TaskService from '@services/task-service.js'
import { USERID_HEADER_KEY } from '@constants/const.js'

class TaskController {
    public async createTask(request: Request, response: Response) {
        const userId = response.get(USERID_HEADER_KEY)
        const { title, description, status } = request.body

        if (!title || !description || !status) {
            response
                .status(400)
                .json({ message: 'title, description, and status required' })
            return
        }
        const newTask = await TaskService.saveNewTask(userId, {
            title,
            description,
            status,
        })
        response.status(200).json(newTask)
    }
    public async getTasks(request: Request, response: Response) {
        const userId = response.get(USERID_HEADER_KEY)
        const tasks = await TaskService.getTasks(userId)
        response.json({
            success: true,
            data: {
                tasks,
            },
        })
    }

    public async patchTask(request: Request, response: Response) {
        const userId = response.get(USERID_HEADER_KEY)
        const { taskId } = request.params

        const { title, description, status } = request.body
        if (!title || !status) {
            response
                .status(400)
                .json({ message: 'title, description, and status required' })
            return
        }
        const updatedTask = await TaskService.updateTask({
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

    public async deleteTask(request: Request, response: Response) {
        try {
            const { taskId } = request.params
            await TaskService.deleteTaskById(taskId)
            response.status(200).json({
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
}

export default new TaskController()
