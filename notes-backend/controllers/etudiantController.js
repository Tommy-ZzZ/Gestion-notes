const { Etudiant } = require('../models');
const { validationResult } = require('express-validator');

exports.createEtudiant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const etudiant = await Etudiant.create(req.body);
    res.status(201).json(etudiant);
  } catch (err) {
    next(err);
  }
};

exports.getEtudiants = async (req, res, next) => {
  try {
    const etudiants = await Etudiant.findAll();
    res.json(etudiants);
  } catch (err) {
    next(err);
  }
};

exports.getEtudiantById = async (req, res, next) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id);
    if (!etudiant) return res.status(404).json({ message: 'Etudiant non trouvé' });
    res.json(etudiant);
  } catch (err) {
    next(err);
  }
};

exports.updateEtudiant = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const etudiant = await Etudiant.findByPk(req.params.id);
    if (!etudiant) return res.status(404).json({ message: 'Etudiant non trouvé' });
    await etudiant.update(req.body);
    res.json(etudiant);
  } catch (err) {
    next(err);
  }
};

exports.deleteEtudiant = async (req, res, next) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id);
    if (!etudiant) return res.status(404).json({ message: 'Etudiant non trouvé' });
    await etudiant.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};