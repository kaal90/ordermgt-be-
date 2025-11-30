'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("Orders", ["id"]);
    await queryInterface.addIndex("Orders", ["orderDescription"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("Orders", ["id"]);
    await queryInterface.removeIndex("Orders", ["orderDescription"]);
  },
};
