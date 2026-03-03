module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    id_etudiant: {
      type: DataTypes.UUID,
      allowNull: false
    },
    id_matiere: { // Nouvelle FK
      type: DataTypes.UUID,
      allowNull: false
    },
    note: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'note'
  });

  Note.associate = (models) => {
    Note.belongsTo(models.Etudiant, { foreignKey: 'id_etudiant' });
    Note.belongsTo(models.Matiere, { foreignKey: 'id_matiere' }); // Nouvelle association
  };

  return Note;
};