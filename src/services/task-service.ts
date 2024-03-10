import { Task } from '@prisma/client'
import { logger } from '@utils/logger-config.js'
import taskRepository from '@repository/task-repository.js'
import ErrorMessages from '@constants/error-message.js'

class TaskService {
    async getTasks(
        userId: string,
        requestId: string,
    ): Promise<Partial<Task>[]> {
        try {
            return await taskRepository.getTasks(userId, requestId)
        } catch (error) {
            logger.error({
                message: 'Error retrieving tasks for user',
                requestId,
                error,
            })
            throw error
        }
    }

    async createNewTask(
        userId: string,
        task: Partial<Task>,
        requestId: string,
    ) {
        try {
            logger.info({
                message: 'Creating new task',
                requestId,
                userId,
            })
            const newTask = await taskRepository.createTask(
                {
                    ...task,
                    userId,
                },
                requestId,
            )
            if (!newTask) {
                throw new Error(ErrorMessages.InternalServerError)
            }
            logger.info({
                message: 'Created new task successfully',
                requestId,
            })
            return newTask
        } catch (error) {
            logger.error({
                message: error.message || ErrorMessages,
                requestId,
                error,
            })
            throw error
        }
    }

    async updateTask(task: Partial<Task>, requestId: string): Promise<Task> {
        try {
            const { id, userId } = task
            logger.info({
                message: 'Updating task...',
                requestId,
            })
            if (!task.id || !task.title || !task.status) {
                throw new Error(ErrorMessages.BadRequest)
            }
            const existingTask = await taskRepository.getTaskById(
                id,
                userId,
                requestId,
            )
            if (!existingTask) {
                throw new Error(ErrorMessages.NotFound)
            }
            const updatedTask = await taskRepository.updateTask(
                id,
                task,
                requestId,
            )
            if (!updatedTask) {
                throw new Error(ErrorMessages.NotFound)
            }
            logger.info({
                message: 'Updated task successfully',
                requestId,
            })
            return updatedTask
        } catch (error) {
            logger.error({
                message: error.message || 'Error updating task',
                requestId,
                error,
            })
            throw error
        }
    }

    async deleteTaskById(
        taskId: string,
        userId: string,
        requestId: string,
    ): Promise<void> {
        try {
            const deleteCount = await taskRepository.deleteTask(
                taskId,
                userId,
                requestId,
            )
            if (deleteCount == 0) {
                throw new Error(ErrorMessages.NotFound)
            }
        } catch (error) {
            logger.error({
                message: error.message || 'Error deleting task',
                requestId,
                error,
            })
            throw error
        }
    }
}
export default new TaskService()
