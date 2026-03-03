const { body } = require('express-validator');

exports.registerValidator = [
  body('username').notEmpty().withMessage('Username requis').isLength({ min: 3 }).withMessage('Username trop court'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Password requis').isLength({ min: 6 }).withMessage('Password trop court'),
  body('g-recaptcha-response').notEmpty().withMessage('CAPTCHA requis')
];

exports.loginValidator = [
  body('username').notEmpty().withMessage('Username requis'),
  body('password').notEmpty().withMessage('Password requis'),
  body('g-recaptcha-response').notEmpty().withMessage('CAPTCHA requis')
];