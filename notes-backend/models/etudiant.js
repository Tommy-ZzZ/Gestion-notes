module.exports = (sequelize, DataTypes) => {
  const Etudiant = sequelize.define('Etudiant', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_etablissement: {
      type: DataTypes.UUID,
      allowNull: false
    },
    matricule: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nom_et: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenom_et: {
      type: DataTypes.STRING,
      allowNull: false
    },
    niveau: {
      type: DataTypes.STRING
    },
    contact: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'etudiant'
  });

  Etudiant.associate = (models) => {
    Etudiant.belongsTo(models.Etablissement, { foreignKey: 'id_etablissement' });
    Etudiant.hasMany(models.Note, { foreignKey: 'id_etudiant' }); // Déjà présent
  };

  return Etudiant;
};