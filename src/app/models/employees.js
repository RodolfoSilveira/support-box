'use strict'
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    name: DataTypes.STRING,
    cpf: {
      type: DataTypes.STRING
      // validate: {
      //   max: 11,
      //   not: ["[a-z]",'i'],
      // }
    },
    rg: {
      type: DataTypes.STRING
      // validate: {
      //   max: 10,
      //   not: ["[a-z]",'i'],
      // }
    },
    pis: {
      type: DataTypes.STRING
      // validate: {
      //   max: 11,
      //   not: ["[a-z]",'i'],
      // }
    },
    address: {
      type: DataTypes.STRING
    }
  }, {})
  Employee.associate = function (models) {
    // associations can be defined here
    Employee.belongsTo(models.User)
  }
  return Employee
}
