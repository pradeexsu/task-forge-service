import { Request, Response } from 'express'
import { Builder } from 'builder-pattern'

import taskService from '@services/task-service.js'

import ErrorMessages from '@constants/error-message.js'
import SuccessMessages from '@constants/success-message.js'
import {
    ApiResponse,
    RequestQuery,
    TaskDto,
    TaskListData,
} from '@type/typings.js'

class TaskController {
    public async createTask(request: Request, response: Response) {
        const { userId, requestId } = request.query as RequestQuery
        const { title, description, status } = request.body
        try {
            if (!title || !description || !status) {
                throw new Error(ErrorMessages.BadRequest)
            }
            const task = await taskService.createNewTask(
                userId,
                request.body,
                requestId,
            )

            const res = Builder<ApiResponse<TaskDto>>()
                .message(SuccessMessages.TaskCreated)
                .success(true)
                .data(task)
                .build()
            response.json(res)
        } catch (error) {
            const res = Builder<ApiResponse<never>>()
                .message(error.message || ErrorMessages.InternalServerError)
                .success(false)
                .build()
            response.json(res)
        }
    }
    public async getTasks(request: Request, response: Response) {
        const { userId, requestId } = request.query as RequestQuery
        try {
            const taskList = await taskService.getTasks(userId, requestId)

            const res = Builder<ApiResponse<TaskListData>>()
                .data({ taskList })
                .success(true)
                .build()
            response.json(res)
        } catch (error) {
            const res = Builder<ApiResponse<never>>()
                .message(error.message || ErrorMessages.InternalServerError)
                .success(false)
                .build()
            response.json(res)
        }
    }

    public async patchTask(request: Request, response: Response) {
        try {
            const { userId, requestId } = request.query as RequestQuery
            const { taskId } = request.params

            const { title, description, status } = request.body
            if (!title || !status) {
                throw new Error(ErrorMessages.BadRequest)
            }
            const updatedTask = await taskService.updateTask(
                {
                    description,
                    id: taskId,
                    userId,
                    status,
                    title,
                },
                requestId,
            )
            const res = Builder<ApiResponse<TaskDto>>()
                .message(SuccessMessages.TaskUpdated)
                .data(updatedTask)
                .success(true)
                .build()
            response.json(res)
        } catch (error) {
            const res = Builder<ApiResponse<never>>()
                .message(error.message || ErrorMessages.InternalServerError)
                .success(false)
                .build()
            response.json(res)
        }
    }

    public async deleteTask(request: Request, response: Response) {
        try {
            const { userId, requestId } = request.query as RequestQuery
            const { taskId } = request.params
            await taskService.deleteTaskById(taskId, userId, requestId)
            const res = Builder<ApiResponse<never>>()
                .message(SuccessMessages.TaskDeleted)
                .success(true)
                .build()
            response.json(res)
        } catch (err) {
            const res = Builder<ApiResponse<never>>()
                .message(err.message || ErrorMessages.InternalServerError)
                .success(false)
                .build()
            response.json(res)
        }
    }
}

export default new TaskController()
