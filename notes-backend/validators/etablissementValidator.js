const { body } = require('express-validator');

exports.createEtablissementValidator = [
  body('nom_etablissement').notEmpty().withMessage('nom_etablissement est requis'),
  body('description').optional().isString()
];

exports.updateEtablissementValidator = [
  body('nom_etablissement').optional().notEmpty(),
  body('description').optional().isString()
];