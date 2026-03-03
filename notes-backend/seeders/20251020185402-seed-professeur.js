'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('professeur', [{
      id: '123e4567-e89b-12d3-a456-426614174001',
      nom_prof: 'Doe',
      prenom_prof: 'John',
      contact: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('professeur', null, {});
  }
};