'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('etablissement', [{
      id: '123e4567-e89b-12d3-a456-426614174000', // UUID exemple, génère un vrai si besoin
      nom_etablissement: 'Université Exemple',
      description: 'Description exemple',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('etablissement', null, {});
  }
};
