const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
const { Client, User } = require('../app/models')

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

module.exports = {

    async index(req, res) {
        const user = await User.findAll({include:[Client]})

        res.send({user})
    },

    async store(req, res) {
        const { name, email, password, cpf } = req.body

        try{
            if(await User.findOne({where:{email}})){
                return res.status(400).send({error: 'User already exists'})
            }

            const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)

            const user = await User.create({ name, email, password: hash  })
                .then(user => user.createClient({
                        name,
                        cpf
                    })
                ).catch(err => console.log(err))

            user.password = undefined

            return res.send({user, token: generateToken({id: user.id})})

        } catch(err){
            return res.status(400).send({ error: 'Registration Failed'})
        } 
    },

    async show(req, res) {

    },

    async update(req, res) {

    },

    async delete(req, res) {

    } 
}