const { Employee, User } = require('../app/models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

function generateToken(params = {}) {
	return jwt.sign(params , authConfig.secret, {
		expiresIn: 86400
	})
}

module.exports = {

    async index(req, res) {
        const users = await User.findAll({
            include: [Employee]
        })
        .catch(err => console.log(err))

        res.send({users})
    },

    async show(req, res){

    },

    async store(req, res){
        const { name, email, password, cpf, rg, pis, address } = req.body

        try {
            if(await User.findOne({where:{email}})){
                return res.status(400).send({error: 'User already exists'})
            }

            const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            
            const user = await User.create({
                name, 
                email, 
                password: hash,
            }).then(user => user.createEmployee({
                name,
                cpf,
                rg,
                pis,
                address,
            })).catch(err => console.log(err))

            user.password = undefined

            return res.send({user, token: generateToken({id: user.id})})

        } catch(err) {
            return res.status(400).send({ error: 'Registration Failed'})
        }
    },

    async update(req, res) {

    },

    async delete(req, res) {

    },
}