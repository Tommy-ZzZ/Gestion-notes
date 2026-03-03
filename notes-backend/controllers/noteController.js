const { Note } = require('../models');
const { validationResult } = require('express-validator');

exports.createNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.findAll({
      include: ['Matiere', 'Etudiant'] // Inclure associations pour afficher noms dans front
    });
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: ['Matiere', 'Etudiant']
    });
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });
    res.json(note);
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });
    await note.update(req.body);
    res.json(note);
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });
    await note.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};