import { Task } from '@prisma/client'
import { logger } from '@utils/logger-config.js'
import prismaClient from '@prisma-client.js'

class TaskService {
    async getTasks(userId: string): Promise<Partial<Task>[]> {
        try {
            logger.info({
                message: 'Retrieving tasks for user',
                userId: userId,
            })

            const tasks = await prismaClient.task.findMany({
                where: {
                    userId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                },
            })
            logger.info({
                message: 'Retrieved tasks for user successfully',
                userId: userId,
                tasks: tasks,
            })
            return tasks
        } catch (error) {
            logger.error({
                message: 'Error retrieving tasks for user',
                userId: userId,
                error: error,
            })
        }
    }

    async saveNewTask(userId: string, task: Partial<Task>) {
        try {
            logger.info({
                message: 'Saving new task',
                userId: userId,
                task: task,
            })

            const newTask = await prismaClient.task.create({
                data: {
                    userId,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                },
            })
            logger.info({
                message: 'Saved new task successfully',
                userId: userId,
                task: newTask,
            })
            return newTask
        } catch (error) {
            logger.error({
                message: 'Error saving new task',
                userId: userId,
                error: error,
            })
        }
    }

    async updateTask(task: Partial<Task>): Promise<Task> {
        try {
            const { id, userId } = task
            logger.info({
                message: 'Updating task',
                userId: userId,
                taskId: id,
                task: task,
            })

            const taskToUpdate = await prismaClient.task?.findUnique({
                where: {
                    id,
                },
            })
            logger.info({
                message: 'Found task to update',
                userId: userId,
                taskId: id,
                task: taskToUpdate,
            })
            if (taskToUpdate?.userId != userId)
                throw new Error('Task not found')
            logger.info({
                message: 'Task not found',
                userId: userId,
                taskId: id,
            })
            taskToUpdate['status'] = task['status']
            taskToUpdate['title'] = task['title']
            taskToUpdate['description'] = task['description']
            const updatedTask = await prismaClient.task.update({
                where: {
                    id: task.id,
                },
                data: taskToUpdate,
            })
            logger.info({
                message: 'Updated task successfully',
                userId: userId,
                taskId: id,
                task: updatedTask,
            })
            return updatedTask
        } catch (error) {
            logger.error({
                message: 'Error updating task',
                userId: task.userId,
                taskId: task.id,
                error: error,
            })
            throw error
        }
    }

    async deleteTaskById(taskId: string): Promise<void> {
        try {
            logger.info({
                message: 'Deleting task',
                taskId: taskId,
            })

            await prismaClient.task.delete({
                where: {
                    id: taskId,
                },
            })
            logger.info({
                message: 'Deleted task successfully',
                taskId: taskId,
            })
        } catch (error) {
            logger.error({
                message: 'Error deleting task',
                taskId: taskId,
            })
            throw error
        }
    }
}
export default new TaskService()
