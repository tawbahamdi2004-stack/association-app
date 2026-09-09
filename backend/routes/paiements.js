const express = require('express');
const router = express.Router();
const Paiement = require('../models/Paiement');
const Affectation = require('../models/Affectation');
const auth = require('../middleware/auth');

// GET tous les paiements
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

// GET un paiement
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

// GET groupes d'un enfant (pour le formulaire de paiement)
router.get('/groupes-enfant/:enfantId', auth, async (req, res) => {
  try {
    const affectations = await Affectation.find({ 
      enfant: req.params.enfantId, 
      statut: 'actif' 
    }).populate('groupe', 'nom activite dateDebut dateFin');
    
    res.json(affectations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST créer un paiement
router.post('/', auth, async (req, res) => {
  try {
    const { enfant, groupe, periode, montant, modePaiement } = req.body;
    
    // 1. Vérifier que l'enfant est bien affecté à ce groupe
    const affectation = await Affectation.findOne({
      enfant,
      groupe,
      statut: 'actif'
    });
    
    if (!affectation) {
      return res.status(400).json({ 
        message: 'Cet enfant n\'est pas affecté à ce groupe !' 
      });
    }
    
    // 2. Générer le numéro de reçu
    const count = await Paiement.countDocuments();
    const numeroRecu = `REC-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    
    const paiement = new Paiement({
      enfant,
      groupe,
      periode,
      montant,
      modePaiement: modePaiement || 'especes',
      numeroRecu
    });
    
    await paiement.save();
    res.status(201).json(paiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT modifier un paiement
router.put('/:id', auth, async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(paiement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE supprimer un paiement
router.delete('/:id', auth, async (req, res) => {
  try {
    await Paiement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Paiement supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;