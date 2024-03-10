import prismaClient from '@prisma-client.js'
import { Task } from '@prisma/client'
import { logger } from '@utils/logger-config.js'

class TaskRepository {
    public async createTask(
        task: Partial<Task>,
        requestId: string,
    ): Promise<Partial<Task>> {
        logger.debug({
            message: 'Creating new task...',
            requestId,
        })

        const newTask = await prismaClient.task.create({
            data: {
                description: task.description,
                userId: task.userId,
                title: task.title,
                status: task.status,
            },
            select: {
                description: true,
                status: true,
                title: true,
                id: true,
            },
        })
        logger.debug({
            message: 'Created new task successfully!',
            requestId,
            task: newTask,
        })
        return newTask
    }

    public async getTasks(
        userId: string,
        requestId: string,
    ): Promise<Partial<Task>[]> {
        logger.debug({
            message: 'Retrieving user task...',
            requestId,
        })
        const taskList = await prismaClient.task.findMany({
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
        logger.debug({
            message: 'Retrieved user task successfully!',
            taskCounts: taskList.length,
            requestId,
        })
        return taskList
    }

    public async getTaskById(
        taskId: string,
        userId: string,
        requestId: string,
    ): Promise<Task> {
        logger.debug({
            message: 'Retrieving a user task...',
            requestId,
        })
        const task = await prismaClient.task.findUnique({
            where: {
                id: taskId,
                userId,
            },
        })
        logger.debug({
            message: 'Retrieved a user task successfully!',
            requestId,
            task,
        })
        return task
    }

    public async updateTask(
        taskId: string,
        task: Partial<Task>,
        requestId: string,
    ): Promise<Task> {
        logger.debug({
            message: 'Updating user task...',
            requestId,
        })
        return await prismaClient.task.update({
            where: {
                id: taskId,
            },
            data: {
                title: task.title,
                description: task.description,
                status: task.status,
            },
        })
    }

    public async deleteTask(
        taskId: string,
        userId: string,
        requestId: string,
    ): Promise<number> {
        logger.debug({
            message: 'Deleting user task...',
            requestId,
        })
        const res = await prismaClient.task.deleteMany({
            where: {
                id: taskId,
                userId,
            },
        })
        return res.count
    }
}
export default new TaskRepository()
