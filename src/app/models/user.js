module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Esse email precisa ser valido'
        },
        isLowercase: {
          msg: 'Não é permitido palavras em caixa alta'
        },
        notEmpty: {
          msg: 'Esse campo não pode ser vazio'
        }
      }
    },
    password: DataTypes.STRING
  }, {})
  User.associate = function (models) {
    // associations can be defined here
    User.hasOne(models.Employee)
    User.hasOne(models.Client)
  }
  return User
}
