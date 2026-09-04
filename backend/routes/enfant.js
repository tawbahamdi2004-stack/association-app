const express = require('express');
const router = express.Router();
const Enfant = require('../models/Enfant');

router.post('/', async (req, res) => {
  try { res.status(201).json(await new Enfant(req.body).save()); } 
  catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const filter = req.query.groupeId ? { groupe: req.query.groupeId } : {};
    res.json(await Enfant.find(filter).populate('groupe', 'nom'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Enfant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enfant supprimé' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;