const express = require('express');
const router = express.Router();
const Groupe = require('../models/Groupe');

// CRÉER un groupe
router.post('/', async (req, res) => {
  try {
    const { nom, periode } = req.body;
    const nouveauGroupe = new Groupe({ nom, periode });
    const groupeEnregistre = await nouveauGroupe.save();
    res.status(201).json(groupeEnregistre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// LISTER tous les groupes
router.get('/', async (req, res) => {
  try {
    const groupes = await Groupe.find().sort({ createdAt: -1 });
    res.json(groupes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// OBTENIR un groupe précis
router.get('/:id', async (req, res) => {
  try {
    const groupe = await Groupe.findById(req.params.id);
    if (!groupe) return res.status(404).json({ message: 'Groupe non trouvé' });
    res.json(groupe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MODIFIER un groupe
router.put('/:id', async (req, res) => {
  try {
    const groupeModifie = await Groupe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!groupeModifie) return res.status(404).json({ message: 'Groupe non trouvé' });
    res.json(groupeModifie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// SUPPRIMER un groupe
router.delete('/:id', async (req, res) => {
  try {
    const groupeSupprime = await Groupe.findByIdAndDelete(req.params.id);
    if (!groupeSupprime) return res.status(404).json({ message: 'Groupe non trouvé' });
    res.json({ message: 'Groupe supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;