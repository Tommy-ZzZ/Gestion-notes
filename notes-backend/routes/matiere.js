const express = require('express');
const router = express.Router();
const matiereController = require('../controllers/matiereController');
const { createMatiereValidator, updateMatiereValidator } = require('../validators/matiereValidator');

router.post('/', createMatiereValidator, matiereController.createMatiere);
router.get('/', matiereController.getMatieres);
router.get('/:id', matiereController.getMatiereById);
router.put('/:id', updateMatiereValidator, matiereController.updateMatiere);
router.delete('/:id', matiereController.deleteMatiere);

module.exports = router;