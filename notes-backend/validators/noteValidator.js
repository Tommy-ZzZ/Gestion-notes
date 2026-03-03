const { body } = require('express-validator');

exports.createNoteValidator = [
  body('id_etudiant').isUUID().withMessage('id_etudiant doit être un UUID valide'),
  body('id_matiere').isUUID().withMessage('id_matiere doit être un UUID valide'), // Nouveau
  body('note').isFloat().withMessage('note doit être un float')
];

exports.updateNoteValidator = [
  body('id_etudiant').optional().isUUID(),
  body('id_matiere').optional().isUUID(), // Nouveau
  body('note').optional().isFloat()
];