const express = require('express');
const router = express.Router();
const Enfant = require('../models/Enfant');
const Affectation = require('../models/Affectation');
const auth = require('../middleware/auth');

// GET tous les enfants
router.get('/', auth, async (req, res) => {
  try {
    const enfants = await Enfant.find().sort({ createdAt: -1 });
    res.json(enfants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un enfant avec ses affectations
router.get('/:id', auth, async (req, res) => {
  try {
    const enfant = await Enfant.findById(req.params.id);
    if (!enfant) return res.status(404).json({ message: 'Enfant non trouvé' });
    
    const affectations = await Affectation.find({ enfant: req.params.id })
      .populate('groupe', 'nom activite dateDebut dateFin');
    
    res.json({ enfant, affectations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST créer un enfant (avec vérification de doublon)
router.post('/', auth, async (req, res) => {
  try {
    const { nom, prenom, telephone } = req.body;
    
    // Vérifier si un enfant avec le même nom + prénom existe déjà
    const existing = await Enfant.findOne({ 
      nom: { $regex: new RegExp(`^${nom}$`, 'i') },
      prenom: { $regex: new RegExp(`^${prenom}$`, 'i') }
    });
    
    if (existing) {
      return res.status(400).json({ 
        message: `Un enfant nommé ${prenom} ${nom} existe déjà !` 
      });
    }
    
    const enfant = new Enfant(req.body);
    await enfant.save();
    res.status(201).json(enfant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT modifier un enfant
router.put('/:id', auth, async (req, res) => {
  try {
    const enfant = await Enfant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(enfant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE supprimer un enfant
router.delete('/:id', auth, async (req, res) => {
  try {
    await Enfant.findByIdAndDelete(req.params.id);
    await Affectation.deleteMany({ enfant: req.params.id });
    res.json({ message: 'Enfant supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;