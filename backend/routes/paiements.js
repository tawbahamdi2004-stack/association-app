const express = require('express');
const router = express.Router();
const Paiement = require('../models/Paiement');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { enfantId, groupeId } = req.query;
    const filter = {};
    if (enfantId) filter.enfant = enfantId;
    if (groupeId) filter.groupe = groupeId;
    
    const paiements = await Paiement.find(filter)
      .populate('enfant', 'nom prenom')
      .populate('groupe', 'nom activite')
      .sort({ datePaiement: -1 });
    
    res.json(paiements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id)
      .populate('enfant', 'nom prenom telephone')
      .populate('groupe', 'nom activite');
    res.json(paiement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const count = await Paiement.countDocuments();
    const numeroRecu = `REC-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    
    const paiement = new Paiement({
      ...req.body,
      numeroRecu
    });
    await paiement.save();
    res.status(201).json(paiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(paiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Paiement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Paiement supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;