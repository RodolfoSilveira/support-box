import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.json'
import { User } from '../app/models'
import { Request, Response } from 'express'
import crypto from 'crypto'
import mailer from '../modules/mailer'

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
        return res.status(400).send({ error: 'User already exists' })
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

  public async forgotPassword (req: Request, res: Response):Promise<Response> {
    const { email } = req.body

    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        return res.status(400).send({ error: 'User not found' })
      }

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      mailer.sendMail({
        to: email,
        from: 'rodolfo360tisilveira@gmail.com',
        template: 'auth/forgot_password',
        context: { token }
      }, (err): any => {
        if (err) {
          console.log(err)
          return res.status(400).send({ error: 'Cannot send forgot password email' })
        }
        return res.send('OK')
      })
    } catch (err) {
      console.log(err)
      res.status(400).send({ error: 'Erro on forgot password, try again' })
    }
  }
}

export default new AuthController()
