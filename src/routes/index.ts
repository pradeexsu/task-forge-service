import { Router } from 'express'
import AuthInterceptor from '@middlewares/auth-interceptor.js'
import TaskController from '@controller/task-controller.js'
import AuthController from '@controller/auth-controller.js'
import PingController from '@controller/ping-controller.js'

const apiRouts = Router()
const authRouts = Router()

apiRouts
    .use(AuthInterceptor.authenticate)
    .get('/tasks', TaskController.getTasks)
    .post('/tasks', TaskController.createTask)
    .patch('/tasks/:taskId', TaskController.patchTask)
    .delete('/tasks/:taskId', TaskController.deleteTask)
    .delete('/logout', AuthController.logout)

authRouts
    .use(AuthInterceptor.attachRequestId)
    .post('/login', AuthController.login)
    .post('/signup', AuthController.register)
    .get('/ping', PingController.ping)

export { authRouts, apiRouts }
