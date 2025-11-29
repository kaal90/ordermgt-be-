'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('OrderProductMap',{
      id:{
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      orderId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Orders',
          key:'id'
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE',
      },
      productId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Products',
          key:'id'
        },
        onUpdate:'CASCADE',
        onDelete:'RESTRICT',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderProductMap');
  }
};
