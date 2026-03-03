'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('etudiant', [{
      id: '123e4567-e89b-12d3-a456-426614174002',
      id_etablissement: '123e4567-e89b-12d3-a456-426614174000',
      matricule: 'MAT001',
      nom_et: 'Smith',
      prenom_et: 'Jane',
      niveau: 'L1',
      contact: 'jane.smith@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('etudiant', null, {});
  }
};
