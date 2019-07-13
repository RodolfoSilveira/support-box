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
        const { id } = req.params

        try{
            const user = await User.findOne({include:[Employee], where: {id}})

            user.password = undefined
    
            return res.send({user})
        }catch(err) {
            return res.status(400).status({error: 'User not found'})
        }
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
        const { id } = req.params
        const { name, email, password, cpf, rg, pis, address } = req.body

        try{
            const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)

            await User.update({ name, email, password: hash },{ where: {id} })
            await Employee.update({ name, cpf, rg, pis, address }, 
                { where: {UserId: id} })
            
            return res.send({success: 'Update Succefuly'})

        } catch(err) {
            return res.status(400).send({ error: 'Update Failed'})
        }
    },

    async delete(req, res) {
        const { id } = req.params

        try{
            await User.destroy({include:[Employee], where: {id}})

            return res.send({delete: OK})
        }catch(err){
            return res.status(400).send({ error: 'delete error'})
        }
    },
}