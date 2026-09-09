const express = require('express');
const router = express.Router();
const Presence = require('../models/Presence');
const Affectation = require('../models/Affectation');
const Groupe = require('../models/Groupe');
const auth = require('../middleware/auth');

// GET toutes les présences
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

// POST enregistrer les présences (avec validation de période)
router.post('/', auth, async (req, res) => {
  try {
    const { groupeId, date, presences } = req.body;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    // 1. Récupérer le groupe pour vérifier la période
    const groupe = await Groupe.findById(groupeId);
    if (!groupe) {
      return res.status(404).json({ message: 'Groupe non trouvé' });
    }
    
    const groupeDebut = new Date(groupe.dateDebut);
    groupeDebut.setHours(0, 0, 0, 0);
    const groupeFin = new Date(groupe.dateFin);
    groupeFin.setHours(23, 59, 59, 999);
    
    // 2. Vérifier que la date est dans la période du groupe
    if (targetDate < groupeDebut || targetDate > groupeFin) {
      return res.status(400).json({ 
        message: `La date doit être entre le ${groupeDebut.toLocaleDateString()} et le ${groupeFin.toLocaleDateString()}` 
      });
    }
    
    // 3. Enregistrer les présences
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

// GET enfants d'un groupe
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