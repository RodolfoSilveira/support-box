import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.json'
import { Client, User } from '../app/models'
import { Request, Response } from 'express'

function generateToken (params = {}): string {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

class ClientController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findAll({ include: [Client] })

      return res.send({ user })
    } catch (err) {
      return res.status(400).send({ error: 'Data not found' })
    }
  }

  public async store (req: Request, res: Response):Promise<Response> {
    const { name, email, password, cpf } = req.body

    try {
      if (await User.findOne({ where: { email } })) {
        return res.status(400).send({ error: 'User already exists' })
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      const user = await User.create({ name, email, password: hash })
        .then(user => user.createClient({
          name,
          cpf
        })
        ).catch(err => console.log(err))

      user.password = undefined

      return res.send({ user, token: generateToken({ id: user.id }) })
    } catch (err) {
      return res.status(400).send({ error: 'Registration Failed' })
    }
  }

  public async show (req: Request, res: Response):Promise<Response> {
    const { id } = req.params

    try {
      const user = await User.findOne({ include: [Client], where: { id } })

      user.password = undefined

      return res.send({ user })
    } catch (err) {
      return res.status(400).send({ error: 'User not found' })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, email, password, cpf } = req.body

    try {
      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      await User.update({ name, email, password: hash }, { where: { id } })
      await Client.update({ name, cpf }, { where: { UserId: id } })

      return res.send({ success: 'Update Succefuly' })
    } catch (err) {
      return res.status(400).send({ error: 'Update Failed' })
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    try {
      await User.destroy({ include: [Client], where: { id } })

      return res.send({ delete: 'OK' })
    } catch (err) {
      return res.status(400).send({ error: 'delete error' })
    }
  }
}

export default new ClientController()
