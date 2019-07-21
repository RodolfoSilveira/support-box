import { Request, Response } from 'express'
import { Task, Client, User } from '../app/models'

class TaskController {
  public async index (req: Request, res: Response): Promise<Response> {
    const task = await Task.findAll({
      include: [{
        model: Client,
        through: { attributes: [] }
      }]
    })

    return res.send({ task })
  }

  public async show (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const task = await Task.findOne({
      include: [{
        model: Client,
        through: { attributes: [] }
      }],
      where: { id }
    })

    return res.send({ task })
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body
    const { userId } = req

    try {
      const client = await User.findOne({ include: [Client], where: { id: userId } })

      const task = await Task.create({ name, description })
      task.setClients(client.Client.id)

      return res.send({ task })
    } catch (err) {
      return res.status(400).send({ err: 'Não foi possivel adicionar Task' })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body
    const { userId } = req
    const { id } = req.params

    try {
      const client = await User.findOne({ include: [Client], where: { id: userId } })
      const task = await Task.findOne({ where: { id } })
      task.update({ name, description })
      task.setClients(client.Client.id)

      return res.send({ task })
    } catch (err) {
      return res.status(400).send({ err: 'Não foi possivel adicionar Task' })
    }
  }

  public async delete (req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    try {
      await Task.destroy({ where: { id } })

      return res.send({ delete: 'OK' })
    } catch (err) {
      return res.status(400).send({ error: 'delete error' })
    }
  }
}

export default new TaskController()
