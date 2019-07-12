const express = require('express')
const multer = require('multer')
const uploadConfig = require('./config/upload')

const routes = new express.Router()
const authMiddleware = require('./middlewares/auth')

const UserController = require('./controllers/UserController')
const AuthController = require('./controllers/AuthController')
const EmployeeController = require('./controllers/EmployeeController')

const upload = multer(uploadConfig)

routes.post('/register', AuthController.store)
routes.post('/authenticate', AuthController.login)
routes.post('/registerEmployee', EmployeeController.store)
routes.get('/employee', EmployeeController.index)

routes.use(authMiddleware)

routes.get('/users', UserController.index)//Listar todos
routes.get('/users/:id', UserController.show) //Buscar
routes.put('/users/:id', UserController.update) //Editar
routes.delete('/users/:id', UserController.delete) //Deletar

module.exports = routes