const { body } = require('express-validator');

exports.createProfesseurValidator = [
  body('nom_prof').notEmpty().withMessage('nom_prof est requis'),
  body('prenom_prof').notEmpty().withMessage('prenom_prof est requis'),
  body('contact').optional().isString()
];

exports.updateProfesseurValidator = [
  body('nom_prof').optional().notEmpty(),
  body('prenom_prof').optional().notEmpty(),
  body('contact').optional().isString()
];