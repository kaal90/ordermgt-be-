'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Products', [
      {
        id: 1,
        productName: 'HP laptop',
        productDescription: 'This is HP laptop'
      },
      {
        id: 2,
        productName: 'Lenovo laptop',
        productDescription: 'This is lenovo'
      },
      {
        id: 3,
        productName: 'Car',
        productDescription: 'This is Car'
      },
      {
        id: 4,
        productName: 'Bike',
        productDescription: 'This is Bike'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
