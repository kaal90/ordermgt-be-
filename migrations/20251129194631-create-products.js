'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Products',{
      id:{
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productName:{
        type: Sequelize.STRING(100),
        allowNull: false
      },
      productDescription:{
        type: Sequelize.TEXT,
        allowNull: true
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
