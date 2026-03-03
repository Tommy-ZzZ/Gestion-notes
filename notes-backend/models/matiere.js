module.exports = (sequelize, DataTypes) => {
  const Matiere = sequelize.define('Matiere', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_professeur: {
      type: DataTypes.UUID,
      allowNull: false
    },
    nom_matiere: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coefficient: {
      type: DataTypes.INTEGER
    },
    credit: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'matiere'
  });

  Matiere.associate = (models) => {
    Matiere.belongsTo(models.Professeur, { foreignKey: 'id_professeur' });
    Matiere.hasMany(models.Note, { foreignKey: 'id_matiere' }); // Nouvelle association
  };

  return Matiere;
};