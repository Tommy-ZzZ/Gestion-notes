const { Matiere } = require('../models');
const { validationResult } = require('express-validator');

exports.createMatiere = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const matiere = await Matiere.create(req.body);
    res.status(201).json(matiere);
  } catch (err) {
    next(err);
  }
};

exports.getMatieres = async (req, res, next) => {
  try {
    const matieres = await Matiere.findAll();
    res.json(matieres);
  } catch (err) {
    next(err);
  }
};

exports.getMatiereById = async (req, res, next) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);
    if (!matiere) return res.status(404).json({ message: 'Matiere non trouvée' });
    res.json(matiere);
  } catch (err) {
    next(err);
  }
};

exports.updateMatiere = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const matiere = await Matiere.findByPk(req.params.id);
    if (!matiere) return res.status(404).json({ message: 'Matiere non trouvée' });
    await matiere.update(req.body);
    res.json(matiere);
  } catch (err) {
    next(err);
  }
};

exports.deleteMatiere = async (req, res, next) => {
  try {
    const matiere = await Matiere.findByPk(req.params.id);
    if (!matiere) return res.status(404).json({ message: 'Matiere non trouvée' });
    await matiere.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};