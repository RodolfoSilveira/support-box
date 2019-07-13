const express = require('express')
const multer = require('multer')
const uploadConfig = require('./config/upload')

const routes = new express.Router()
const authMiddleware = require('./middlewares/auth')

const UserController = require('./controllers/UserController')
const AuthController = require('./controllers/AuthController')
const EmployeeController = require('./controllers/EmployeeController')
const ClientController = require('./controllers/ClientController')

const upload = multer(uploadConfig)

//routes user
routes.post('/register', AuthController.store)
//login
routes.post('/authenticate', AuthController.login)
//routes employee
routes.post('/registerEmployee', EmployeeController.store)
routes.get('/employee', EmployeeController.index)
//routes client
routes.post('/registerClient', ClientController.store)
routes.get('/client', ClientController.index)

routes.use(authMiddleware)

routes.get('/users', UserController.index)//Listar todos
routes.get('/users/:id', UserController.show) //Buscar
routes.put('/users/:id', UserController.update) //Editar
routes.delete('/users/:id', UserController.delete) //Deletar

module.exports = routes