'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Etablissement extends Model {
    static associate(models) {
      Etablissement.hasMany(models.Etudiant, { foreignKey: 'id_etablissement' });
    }
  }
  Etablissement.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    nom_etablissement: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Etablissement',
    tableName: 'etablissement',
    timestamps: true // Assure que createdAt et updatedAt sont gérés
  });
  return Etablissement;
};