require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Autorise toutes les origines pour faciliter le déploiement zéro-config

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB:', err));

app.use('/api/groupes', require('./routes/groupes'));
app.use('/api/enfants', require('./routes/enfants'));
app.use('/api/presences', require('./routes/presences'));
app.use('/api/paiements', require('./routes/paiements'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));