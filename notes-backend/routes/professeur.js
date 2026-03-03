const express = require('express');
const router = express.Router();
const professeurController = require('../controllers/professeurController');
const { createProfesseurValidator, updateProfesseurValidator } = require('../validators/professeurValidator');

router.post('/', createProfesseurValidator, professeurController.createProfesseur);
router.get('/', professeurController.getProfesseurs);
router.get('/:id', professeurController.getProfesseurById);
router.put('/:id', updateProfesseurValidator, professeurController.updateProfesseur);
router.delete('/:id', professeurController.deleteProfesseur);

module.exports = router;