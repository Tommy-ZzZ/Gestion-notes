const { body } = require('express-validator');

exports.createEtudiantValidator = [
  body('id_etablissement').isUUID().withMessage('id_etablissement doit être un UUID valide'),
  body('matricule').notEmpty().withMessage('matricule est requis'),
  body('nom_et').notEmpty().withMessage('nom_et est requis'),
  body('prenom_et').notEmpty().withMessage('prenom_et est requis'),
  body('niveau').optional().isString(),
  body('contact').optional().isString()
];

exports.updateEtudiantValidator = [
  body('id_etablissement').optional().isUUID(),
  body('matricule').optional().notEmpty(),
  body('nom_et').optional().notEmpty(),
  body('prenom_et').optional().notEmpty(),
  body('niveau').optional().isString(),
  body('contact').optional().isString()
];