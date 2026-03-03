const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { createNoteValidator, updateNoteValidator } = require('../validators/noteValidator');

router.post('/', createNoteValidator, noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', updateNoteValidator, noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;