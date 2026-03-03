const { Etablissement } = require('../models');
const { validationResult } = require('express-validator');

exports.createEtablissement = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const etablissement = await Etablissement.create(req.body);
    res.status(201).json(etablissement);
  } catch (err) {
    next(err);
  }
};

exports.getEtablissements = async (req, res, next) => {
  try {
    const etablissements = await Etablissement.findAll();
    res.json(etablissements);
  } catch (err) {
    next(err);
  }
};

exports.getEtablissementById = async (req, res, next) => {
  try {
    const etablissement = await Etablissement.findByPk(req.params.id);
    if (!etablissement) return res.status(404).json({ message: 'Etablissement non trouvé' });
    res.json(etablissement);
  } catch (err) {
    next(err);
  }
};

exports.updateEtablissement = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const etablissement = await Etablissement.findByPk(req.params.id);
    if (!etablissement) return res.status(404).json({ message: 'Etablissement non trouvé' });
    await etablissement.update(req.body);
    res.json(etablissement);
  } catch (err) {
    next(err);
  }
};

exports.deleteEtablissement = async (req, res, next) => {
  try {
    const etablissement = await Etablissement.findByPk(req.params.id);
    if (!etablissement) return res.status(404).json({ message: 'Etablissement non trouvé' });
    await etablissement.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};