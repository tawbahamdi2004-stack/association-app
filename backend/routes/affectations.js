const express = require('express');
const router = express.Router();
const Affectation = require('../models/Affectation');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { enfantId, groupeId } = req.query;
    const filter = {};
    if (enfantId) filter.enfant = enfantId;
    if (groupeId) filter.groupe = groupeId;
    
    const affectations = await Affectation.find(filter)
      .populate('enfant', 'nom prenom')
      .populate('groupe', 'nom activite');
    
    res.json(affectations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const affectation = new Affectation(req.body);
    await affectation.save();
    res.status(201).json(affectation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Affectation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Affectation supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;