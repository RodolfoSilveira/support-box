const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const server = require('http').Server(app)
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));
app.use(require('./routes'))

server.listen(3333)
