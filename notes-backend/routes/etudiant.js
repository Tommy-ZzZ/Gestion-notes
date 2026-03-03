const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');
const { createEtudiantValidator, updateEtudiantValidator } = require('../validators/etudiantValidator');

router.post('/', createEtudiantValidator, etudiantController.createEtudiant);
router.get('/', etudiantController.getEtudiants);
router.get('/:id', etudiantController.getEtudiantById);
router.put('/:id', updateEtudiantValidator, etudiantController.updateEtudiant);
router.delete('/:id', etudiantController.deleteEtudiant);

module.exports = router;