require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la DB réussie.');
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de connexion à la DB:', err);
  });