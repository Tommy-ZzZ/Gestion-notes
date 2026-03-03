'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matiere', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      id_professeur: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'professeur',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      nom_matiere: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coefficient: {
        type: Sequelize.INTEGER
      },
      credit: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('matiere');
  }
};
