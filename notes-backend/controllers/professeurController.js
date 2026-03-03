const { Professeur } = require('../models');
const { validationResult } = require('express-validator');

exports.createProfesseur = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const professeur = await Professeur.create(req.body);
    res.status(201).json(professeur);
  } catch (err) {
    next(err);
  }
};

exports.getProfesseurs = async (req, res, next) => {
  try {
    const professeurs = await Professeur.findAll();
    res.json(professeurs);
  } catch (err) {
    next(err);
  }
};

exports.getProfesseurById = async (req, res, next) => {
  try {
    const professeur = await Professeur.findByPk(req.params.id);
    if (!professeur) return res.status(404).json({ message: 'Professeur non trouvé' });
    res.json(professeur);
  } catch (err) {
    next(err);
  }
};

exports.updateProfesseur = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const professeur = await Professeur.findByPk(req.params.id);
    if (!professeur) return res.status(404).json({ message: 'Professeur non trouvé' });
    await professeur.update(req.body);
    res.json(professeur);
  } catch (err) {
    next(err);
  }
};

exports.deleteProfesseur = async (req, res, next) => {
  try {
    const professeur = await Professeur.findByPk(req.params.id);
    if (!professeur) return res.status(404).json({ message: 'Professeur non trouvé' });
    await professeur.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};