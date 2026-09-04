const express = require('express');
const router = express.Router();
const Presence = require('../models/Presence');

router.post('/', async (req, res) => {
  try {
    const { groupeId, date, presences } = req.body; // presences = [{enfantId, present}]
    const resultats = [];
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    for (const p of presences) {
      const presence = await Presence.findOneAndUpdate(
        { enfant: p.enfantId, groupe: groupeId, date: targetDate },
        { present: p.present, groupe: groupeId, date: targetDate, enfant: p.enfantId },
        { upsert: true, new: true }
      ).populate('enfant', 'nom');
      resultats.push(presence);
    }
    res.status(201).json(resultats);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/', async (req, res) => {
  try {
    const { groupeId, date } = req.query;
    const filter = { groupe: groupeId };
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    res.json(await Presence.find(filter).populate('enfant', 'nom telephone'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;