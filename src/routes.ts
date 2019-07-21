import { Router } from 'express'
import authMiddleware from './middlewares/auth'
import UserController from './controllers/UserController'
import AuthController from './controllers/AuthController'
import EmployeeController from './controllers/EmployeeController'
import ClientController from './controllers/ClientController'
import TaskController from './controllers/TaskController'
const routes = Router()

// routes user
routes.post('/register', AuthController.store)
// login
routes.post('/authenticate', AuthController.login)
routes.post('/forgot_password', AuthController.forgotPassword)
routes.put('/reset_password', AuthController.resetPassword)
// routes employee
routes.post('/registerEmployee', EmployeeController.store)
routes.get('/employee', EmployeeController.index)
routes.get('/employee/:id', EmployeeController.show)
routes.put('/employee/:id', EmployeeController.update)
routes.delete('/employee/:id', EmployeeController.delete)
// routes client
routes.post('/registerClient', ClientController.store)
routes.get('/client', ClientController.index)
routes.get('/client/:id', ClientController.show)
routes.put('/client/:id', ClientController.update)
routes.delete('/client/:id', ClientController.delete)

routes.use(authMiddleware)

routes.get('/task', TaskController.index)
routes.get('/task/:id', TaskController.show)
routes.post('/task', TaskController.store)
routes.put('/task/:id', TaskController.update)
routes.delete('/task/:id', TaskController.delete)
// routes.get('/users', UserController.index)// Listar todos
// routes.get('/users/:id', UserController.show) // Buscar
// routes.put('/users/:id', UserController.update) // Editar
// routes.delete('/users/:id', UserController.delete) // Deletar

export default routes
