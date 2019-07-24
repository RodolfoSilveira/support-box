import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import config from '../../config/database.js'
import Acl from 'acl'
import AclSeq from 'sequelize-acl'

const db = {}
const sequelize = new Sequelize(config)
export const acl = new Acl(new AclSeq(sequelize, { prefix: 'acl_' }))

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
