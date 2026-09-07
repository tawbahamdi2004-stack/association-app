const express = require('express');
const router = express.Router();
const Enfant = require('../models/Enfant');
const Groupe = require('../models/Groupe');
const Paiement = require('../models/Paiement');
const Presence = require('../models/Presence');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const totalEnfants = await Enfant.countDocuments({ statut: 'actif' });
    const totalGroupes = await Groupe.countDocuments({ statut: 'actif' });
    
    const paiementsTotal = await Paiement.aggregate([
      { $match: { statut: 'paye' } },
      { $group: { _id: null, total: { $sum: '$montant' } } }
    ]);
    
    const paiementsEnAttente = await Paiement.aggregate([
      { $match: { statut: 'en_attente' } },
      { $group: { _id: null, total: { $sum: '$montant' } } }
    ]);
    
    const groupesActifs = await Groupe.find({ statut: 'actif' }).limit(5);
    
    res.json({
      totalEnfants,
      totalGroupes,
      totalPaiements: paiementsTotal[0]?.total || 0,
      paiementsEnAttente: paiementsEnAttente[0]?.total || 0,
      groupesActifs
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;