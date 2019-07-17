import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.json'
import { User } from '../app/models'
import { Request, Response } from 'express'

function generateToken (params = {}): string {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

class AuthController {
  public async store (req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body

    try {
      if (await User.findOne({ where: { email } })) {
        return res.status(400).send({error: 'User already exists' })
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      const user = await User.create({ name, email, password: hash })

      user.password = undefined

      return res.send({ user, token: generateToken({ id: user.id }) })
    } catch (err) {
      return res.status(400).send({ error: 'Registration Failed' })
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    const user = await User.findOne({
      password,
      where: { email }
    })

    if (!user) {
      return res.status(400).send({ error: 'User not found' })
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).send({ error: 'Invalid Password' })
    }

    user.password = undefined

    res.send({ user, token: generateToken({ id: user.id }) })
  }
}

export default new AuthController()
