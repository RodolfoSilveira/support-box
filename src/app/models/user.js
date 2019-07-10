module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Esse email precisa ser valido'
        },
        isLowercase: {
          msg: 'Não é permitido palavras em caixa alta'
        },
        notNull: {
          msg: 'Esse campo não pode ser nulo'
        },
        notEmpty: {
          msg: 'Esse campo não pode ser vazio'
        },
      }
    },
    password: DataTypes.STRING,
  })

  return User
}