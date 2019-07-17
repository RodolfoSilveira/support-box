import { Employee, User } from '../app/models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.json'
import { Request, Response } from 'express'

function generateToken (params = {}): string {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

class EmployeeController {
  public async index (req: Request, res: Response):Promise<Response> {
    const users = await User.findAll({
      include: [Employee]
    }).catch(err => console.log(err))

    return res.send({ users })
  }

  public async show (req: Request, res: Response):Promise<Response> {
    const { id } = req.params

    try {
      const user = await User.findOne({ include: [Employee], where: { id } })

      user.password = undefined

      return res.send({ user })
    } catch (err) {
      return res.status(400).send({ error: 'User not found' })
    }
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { name, email, password, cpf, rg, pis, address } = req.body

    try {
      if (await User.findOne({ where: { email } })) {
        return res.status(400).send({ error: 'User already exists' })
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      const user = await User.create({
        name,
        email,
        password: hash
      }).then(user => user.createEmployee({
        name,
        cpf,
        rg,
        pis,
        address
      })).catch(err => console.log(err))

      user.password = undefined

      return res.send({ user, token: generateToken({ id: user.id }) })
    } catch (err) {
      return res.status(400).send({ error: 'Registration Failed' })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, email, password, cpf, rg, pis, address } = req.body

    try {
      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      await User.update({ name, email, password: hash }, { where: { id } })
      await Employee.update({ name, cpf, rg, pis, address },
        { where: { UserId: id } })

      return res.send({success: 'Update Succefuly' })
    } catch (err) {
      return res.status(400).send({ error: 'Update Failed' })
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    try {
      await User.destroy({ include: [Employee], where: { id } })

      return res.send({ delete: 'OK' })
    } catch (err) {
      return res.status(400).send({ error: 'delete error' })
    }
  }
}

export default new EmployeeController()
