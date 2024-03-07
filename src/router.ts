import { Router } from 'express'
import {
    authenticate,
    login,
    register,
    unAuthenticate,
} from './controller/auth-controller.js'
import {
    createTask,
    deleteTask,
    getTasks,
    patchTask,
} from './controller/task-controller.js'

const authRout = Router()
const unAuthRout = Router()

authRout
    .use(authenticate)
    .get('/tasks', getTasks)
    .post('/tasks', createTask)
    .patch('/tasks/:taskId', patchTask)
    .delete('/tasks/:taskId', deleteTask)

unAuthRout
    .use(unAuthenticate)
    .post('/login', login)
    .post('/register', register)
    .get('/ping', () => 'pong')

export { authRout, unAuthRout }
