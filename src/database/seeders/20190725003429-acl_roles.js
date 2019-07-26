'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('acl_roles', [{
      key: 1,
      value: 'client',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      key: 2,
      value: 'employee',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      key: 3,
      value: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('acl_roles', null, {})
  }
}
