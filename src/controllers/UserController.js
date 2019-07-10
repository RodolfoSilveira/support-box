const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { User } = require('../app/models')

module.exports = {

  async index(req, res) {
    const users = await User.findAll()

    res.json(users)
  },

  async show(req, res) {
    const { id } = req.params

    const user = await User.findOne({where: {id: id}})

    return res.json(user)
  },

  async update(req, res) {
    const { id } = req.params
    const { name, email, password } = req.body
    
    const user = await User.update({ name, email, password },{ where: {id: id}})

    return res.json(user)
  },

  async delete(req, res) {
    const { id } = req.params

    const user = await User.destroy({where: {id: id}})

    return res.json(user)
  },

}