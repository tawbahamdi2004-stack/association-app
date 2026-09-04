const express = require('express');
const router = express.Router();
const Groupe = require('../models/Groupe');
const Enfant = require('../models/Enfant');
const Presence = require('../models/Presence');
const Paiement = require('../models/Paiement');

router.post('/', async (req, res) => {
  try {
    const nouveauGroupe = new Groupe(req.body);
    res.status(201).json(await nouveauGroupe.save());
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const groupes = await Groupe.find().sort({ createdAt: -1 });
    res.json(groupes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    // Suppression en cascade pour éviter les données orphelines
    await Enfant.deleteMany({ groupe: req.params.id });
    await Presence.deleteMany({ groupe: req.params.id });
    await Paiement.deleteMany({ groupe: req.params.id });
    await Groupe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Groupe et toutes ses données associées supprimés' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;