import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password requis seulement si pas de Google ID
    },
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
  },
  googleId: {
    type: String,
    sparse: true, // Permet les valeurs null/undefined
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// Hash password avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);