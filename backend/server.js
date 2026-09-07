require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enfants', require('./routes/enfant'));
app.use('/api/groupes', require('./routes/groupes'));
app.use('/api/affectations', require('./routes/affectations'));
app.use('/api/presences', require('./routes/presence'));
app.use('/api/paiements', require('./routes/paiements'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Backend de l\'application Association fonctionne ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));