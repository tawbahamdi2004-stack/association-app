const express = require('express');
const router = express.Router();
const Presence = require('../models/Presence');
const Affectation = require('../models/Affectation');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { groupeId, date, enfantId } = req.query;
    const filter = {};
    if (groupeId) filter.groupe = groupeId;
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    if (enfantId) filter.enfant = enfantId;
    
    const presences = await Presence.find(filter)
      .populate('enfant', 'nom prenom')
      .populate('groupe', 'nom');
    
    res.json(presences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { groupeId, date, presences } = req.body;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const resultats = [];
    for (const p of presences) {
      const presence = await Presence.findOneAndUpdate(
        { enfant: p.enfantId, groupe: groupeId, date: targetDate },
        { present: p.present, motif: p.motif || '' },
        { upsert: true, new: true }
      ).populate('enfant', 'nom prenom');
      resultats.push(presence);
    }
    res.status(201).json(resultats);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/enfants/:groupeId', auth, async (req, res) => {
  try {
    const affectations = await Affectation.find({ 
      groupe: req.params.groupeId, 
      statut: 'actif' 
    }).populate('enfant', 'nom prenom telephone');
    
    res.json(affectations.map(a => a.enfant));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;