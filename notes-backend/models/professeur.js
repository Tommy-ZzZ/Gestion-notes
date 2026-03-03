module.exports = (sequelize, DataTypes) => {
  const Professeur = sequelize.define('Professeur', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nom_prof: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenom_prof: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contact: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'professeur'
  });

  Professeur.associate = (models) => {
    Professeur.hasMany(models.Matiere, { foreignKey: 'id_professeur' });
  };

  return Professeur;
};