const { body } = require('express-validator');

exports.createMatiereValidator = [
  body('id_professeur').isUUID().withMessage('id_professeur doit être un UUID valide'),
  body('nom_matiere').notEmpty().withMessage('nom_matiere est requis'),
  body('coefficient').optional().isInt(),
  body('credit').optional().isInt()
];

exports.updateMatiereValidator = [
  body('id_professeur').optional().isUUID(),
  body('nom_matiere').optional().notEmpty(),
  body('coefficient').optional().isInt(),
  body('credit').optional().isInt()
];