'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('note', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      id_etudiant: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'etudiant',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      id_matiere: { // Nouvelle FK
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'matiere',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      note: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('note');
  }
};