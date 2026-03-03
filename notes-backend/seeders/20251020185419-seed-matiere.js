'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('matiere', [{
      id: '123e4567-e89b-12d3-a456-426614174003',
      id_professeur: '123e4567-e89b-12d3-a456-426614174001',
      nom_matiere: 'Mathématiques',
      coefficient: 2,
      credit: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('matiere', null, {});
  }
};
