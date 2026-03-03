const express = require('express');
const router = express.Router();
const etablissementController = require('../controllers/etablissementController');
const { createEtablissementValidator, updateEtablissementValidator } = require('../validators/etablissementValidator');

router.post('/', createEtablissementValidator, etablissementController.createEtablissement);
router.get('/', etablissementController.getEtablissements);
router.get('/:id', etablissementController.getEtablissementById);
router.put('/:id', updateEtablissementValidator, etablissementController.updateEtablissement);
router.delete('/:id', etablissementController.deleteEtablissement);

module.exports = router;