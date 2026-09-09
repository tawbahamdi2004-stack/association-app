const express = require('express');
const router = express.Router();
const Affectation = require('../models/Affectation');
const Groupe = require('../models/Groupe');
const auth = require('../middleware/auth');

// GET toutes les affectations (avec filtres)
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

// POST créer une affectation (avec validations)
router.post('/', auth, async (req, res) => {
  try {
    const { enfant, groupe, dateDebut, dateFin } = req.body;
    
    // 1. Vérifier que l'enfant n'est pas déjà dans ce groupe
    const existing = await Affectation.findOne({ 
      enfant, 
      groupe, 
      statut: 'actif' 
    });
    
    if (existing) {
      return res.status(400).json({ 
        message: 'Cet enfant est déjà affecté à ce groupe !' 
      });
    }
    
    // 2. Vérifier que le groupe existe
    const groupeDoc = await Groupe.findById(groupe);
    if (!groupeDoc) {
      return res.status(404).json({ message: 'Groupe non trouvé' });
    }
    
    const affectation = new Affectation({
      enfant,
      groupe,
      dateDebut: dateDebut || groupeDoc.dateDebut,
      dateFin: dateFin || groupeDoc.dateFin,
      statut: 'actif'
    });
    
    await affectation.save();
    res.status(201).json(affectation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE supprimer une affectation
router.delete('/:id', auth, async (req, res) => {
  try {
    await Affectation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Affectation supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;