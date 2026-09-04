const mongoose = require('mongoose');
const presenceSchema = new mongoose.Schema({
  enfant: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant', required: true },
  groupe: { type: mongoose.Schema.Types.ObjectId, ref: 'Groupe', required: true },
  date: { type: Date, required: true },
  present: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Presence', presenceSchema);