// controllers/userController.js
const { User, sequelize } = require('../models'); // Ajout de sequelize
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_jwt_secret'; // À remplacer par une variable d'environnement en prod
const RECAPTCHA_SECRET = '6LdAlPMrAAAAALGkVUfkvpODShnOBZucIaqeIISz';

async function verifyRecaptcha(token) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET}&response=${token}`
  });
  const data = await response.json();
  return data.success;
}

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password, 'g-recaptcha-response': recaptchaToken } = req.body;

  const captchaValid = await verifyRecaptcha(recaptchaToken);
  if (!captchaValid) return res.status(400).json({ message: 'CAPTCHA invalide' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Utilisateur créé', user: { id: user.id, username, email } });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Username ou email déjà utilisé' });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password, 'g-recaptcha-response': recaptchaToken } = req.body;

  const captchaValid = await verifyRecaptcha(recaptchaToken);
  if (!captchaValid) return res.status(400).json({ message: 'CAPTCHA invalide' });

  try {
    console.log('Login attempt:', { username, password }); // Debug
    const user = await User.findOne({
      where: {
        username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), username.toLowerCase())
      }
    });
    console.log('User found:', user ? user.username : 'Not found'); // Debug
    if (!user) return res.status(401).json({ message: 'Credentials invalides' });

    const passwordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', passwordValid); // Debug
    if (!passwordValid) return res.status(401).json({ message: 'Credentials invalides' });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};