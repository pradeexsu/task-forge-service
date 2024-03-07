import { Task } from '@prisma/client'
import { prismaClient } from '../prisma-client.js'
import { logger } from '../logger-config.js'

/**
 * This TypeScript function retrieves tasks for a specific user from a database using Prisma Client.
 * @param {string} userId - The `getTasks` function is an asynchronous function that retrieves tasks
 * from a database using Prisma Client. It takes a `userId` parameter of type string, which is used to
 * filter tasks based on the user ID.
 * @returns The `getTasks` function is returning an array of tasks that belong to the specified
 * `userId`. Each task object in the array includes the `id`, `title`, `description`, and `status`
 * properties.
 */
export const getTasks = async (userId: string) => {
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

/**
 * The function `saveNewTask` saves a new task associated with a specific user in a database using
 * Prisma Client.
 * @param {string} userId - The `userId` parameter is a string that represents the unique identifier of
 * the user for whom the task is being created.
 * @param {any} task - The `task` parameter in the `saveNewTask` function represents the task object
 * that you want to save in the database. It should contain all the necessary information related to
 * the task, such as its title, description, due date, priority, etc.
 * @returns The `saveNewTask` function is returning the newly created task object that was saved in the
 * database.
 */
export const saveNewTask = async (userId: string, task: Partial<Task>) => {
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

/**
 * This TypeScript function updates a task in a database based on the provided partial task object.
 * @param task - The `task` parameter in the `updateTask` function is a partial object of type `Task`.
 * It contains information about a task that needs to be updated. The properties of the `task` object
 * include `id`, `userId`, `status`, `title`, and `description`.
 * @returns The `updateTask` function returns the updated task object after updating its status, title,
 * and description in the database using Prisma client.
 */
export const updateTask = async (task: Partial<Task>) => {
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
        if (taskToUpdate?.userId != userId) throw new Error('Task not found')
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
        return {
            success: true,
            task: updatedTask,
        }
    } catch (error) {
        logger.error({
            message: 'Error updating task',
            userId: task.userId,
            taskId: task.id,
            error: error,
        })
        return {
            success: false,
            error: error,
        }
    }
}

/**
 * The function `deleteTaskById` deletes a task from the database based on its ID.
 * @param {string} taskId - The `taskId` parameter is a string that represents the unique identifier of
 * the task that needs to be deleted. This identifier is used to locate the specific task in the
 * database and remove it from the task list.
 * @returns The `deleteTaskById` function is returning the deleted task object after deleting it from
 * the database using Prisma Client.
 */
export const deleteTaskById = async (taskId: string) => {
    try {
        logger.info({
            message: 'Deleting task',
            taskId: taskId,
        })
        await prismaClient.task.deleteMany({
            where: {
                id: taskId,
            },
        })
        logger.info({
            message: 'Deleted task successfully',
            taskId: taskId,
        })
        return { sucess: true }
    } catch (error) {
        logger.error({
            message: 'Error deleting task',
            taskId: taskId,
            error: error,
        })
    }
}

/**
 * This TypeScript function retrieves tasks associated with a specific user ID using PrismaClient.
 * @param {string} userId - The `userId` parameter in the `getUserTask` function is a string that
 * represents the unique identifier of the user for whom you want to retrieve tasks. This parameter is
 * used to filter tasks based on the user to fetch tasks associated with that specific user.
 * @returns The `getUserTask` function is returning an array of tasks that belong to the user with the
 * specified `userId`. Each task object in the array includes the `id`, `title`, `description`, and
 * `status` properties.
 */
export const getUserTask = async (userId: string) => {
    try {
        logger.info({
            message: 'Retrieving tasks for user',
            userId: userId,
        })
        const task = await prismaClient.task.findMany({
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
            task: task,
        })
        return task
    } catch (error) {
        logger.error({
            message: 'Error retrieving tasks for user',
        })
    }
}
