'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('note', [{
      id: '123e4567-e89b-12d3-a456-426614174004',
      id_etudiant: '123e4567-e89b-12d3-a456-426614174002',
      id_matiere: '123e4567-e89b-12d3-a456-426614174003', // Nouveau, référence à matiere
      note: 15.5,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('note', null, {});
  }
};
