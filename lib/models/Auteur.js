import mongoose from 'mongoose';

const AuteurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  nationalite: {
    type: String,
    required: [true, 'La nationalité est requise'],
    trim: true,
  },
  date_naissance: {
    type: Date,
    required: [true, 'La date de naissance est requise'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Auteur || mongoose.model('Auteur', AuteurSchema);