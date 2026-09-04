const express = require('express');
const router = express.Router();
const Paiement = require('../models/Paiement');

router.post('/', async (req, res) => {
  try { res.status(201).json(await new Paiement(req.body).save()); } 
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const filter = req.query.groupeId ? { groupe: req.query.groupeId } : {};
    res.json(await Paiement.find(filter).populate('groupe', 'nom').populate('enfant', 'nom'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;