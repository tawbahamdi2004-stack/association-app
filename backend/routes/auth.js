const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email incorrect' });

    const valide = await user.comparerMotDePasse(motDePasse);
    if (!valide) return res.status(400).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { id: user._id, nom: user.nom, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, nom: user.nom, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ROUTE TEMPORAIRE POUR CRÉER LE PREMIER ADMIN ---
router.post('/create-admin', async (req, res) => {
  try {
    const user = new User({
      nom: 'Admin',
      email: 'admin@association.com',
      motDePasse: 'admin123',
      role: 'admin'
    });
    await user.save();
    res.json({ message: '✅ Admin créé avec succès !', email: 'admin@association.com' });
  } catch (err) {
    res.status(400).json({ message: 'Erreur (l\'email existe peut-être déjà): ' + err.message });
  }
});
// ----------------------------------------------------

module.exports = router;