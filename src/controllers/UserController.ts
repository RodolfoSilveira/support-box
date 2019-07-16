import { Request, Response } from 'express'
import { User } from '../app/models'

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.findAll()

    return res.json(users)
  }

  public async show (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const user = await User.findOne({ where: { id: id } })

    return res.json(user)
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, email, password } = req.body

    const user = await User.update({ name, email, password }, { where: { id: id } })

    return res.json(user)
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const user = await User.destroy({ where: { id: id } })

    return res.json(user)
  }
}

export default new UserController()
