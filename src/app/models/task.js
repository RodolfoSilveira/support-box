'use strict'
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {})
  Task.associate = function (models) {
    // associations can be defined here
    Task.belongsToMany(models.Client, { through: 'Client_Tasks', foreignKey: 'TaskId' })
  }
  return Task
}
