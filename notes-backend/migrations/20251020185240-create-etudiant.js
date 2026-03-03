'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('etudiant', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      id_etablissement: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'etablissement',
          key: 'id'
        },
        onDelete: 'CASCADE' // Optionnel: cascade pour éviter FK violations
      },
      matricule: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nom_et: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prenom_et: {
        type: Sequelize.STRING,
        allowNull: false
      },
      niveau: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('etudiant');
  }
};
