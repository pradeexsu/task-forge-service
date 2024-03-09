import { Router } from 'express'
import AuthInterceptor from '@middlewares/auth-interceptor.js'
import TaskController from '@controller/task-controller.js'
import AuthController from '@controller/auth-controller.js'

const apiRouts = Router()
const authRouts = Router()

apiRouts
    .use(AuthInterceptor.authenticate)
    .get('/tasks', TaskController.getTasks)
    .post('/tasks', TaskController.createTask)
    .patch('/tasks/:taskId', TaskController.patchTask)
    .delete('/tasks/:taskId', TaskController.deleteTask)

authRouts
    .use(AuthInterceptor.unAuthenticate)
    .post('/login', AuthController.login)
    .post('/signup', AuthController.register)
    .get('/ping', () => 'pong')

export { authRouts, apiRouts }
