const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
const { User } = require('../app/models')

function generateToken(params = {}) {
	return jwt.sign(params , authConfig.secret, {
		expiresIn: 86400
	})
}

module.exports = {
	
	async store(req, res) {
    const { name, email, password } = req.body

    try{
      if(await User.findOne({where:{email}})){
        return res.status(400).send({error: 'User already exists'})
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)

      const user = await User.create({ name, email, password: hash })

      user.password = undefined

      return res.send({user, token: generateToken({id: user.id})})

    }catch(err){
      return res.status(400).send({ error: 'Registration Failed'})
    }
  
	},

	async login(req, res) {
    const { email, password } = req.body

    const user = await User.findOne({
      password,
      where:{email}
    })
    
    if(!user){
      return res.status(400).send({error: 'User not found'})
    }

    if(!await bcrypt.compare(password, user.password)){
      return res.status(400).send({error: 'Invalid Password'})
		}
		
    user.password = undefined

    res.send({ user, token: generateToken({id: user.id }) })
  }

}