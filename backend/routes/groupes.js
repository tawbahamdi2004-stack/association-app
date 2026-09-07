const express = require('express');
const router = express.Router();
const Groupe = require('../models/Groupe');
const Affectation = require('../models/Affectation');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const groupes = await Groupe.find().sort({ createdAt: -1 });
    res.json(groupes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const groupe = await Groupe.findById(req.params.id);
    if (!groupe) return res.status(404).json({ message: 'Groupe non trouvé' });
    
    const affectations = await Affectation.find({ groupe: req.params.id, statut: 'actif' })
      .populate('enfant', 'nom prenom telephone');
    
    res.json({ groupe, affectations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const groupe = new Groupe(req.body);
    await groupe.save();
    res.status(201).json(groupe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const groupe = await Groupe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(groupe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Groupe.findByIdAndDelete(req.params.id);
    await Affectation.deleteMany({ groupe: req.params.id });
    res.json({ message: 'Groupe supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;