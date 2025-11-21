import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nom de la voiture requis'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Marque requise'],
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['compact', 'suv', 'berline', 'break', 'utilitaire'],
    required: [true, 'Type requis'],
    lowercase: true
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Prix par jour requis'],
    min: [0, 'Prix doit être positif']
  },
  fuel: {
    type: String,
    enum: ['essence', 'diesel', 'electrique', 'hybride'],
    required: [true, 'Type de carburant requis'],
    lowercase: true
  },
  transmission: {
    type: String,
    enum: ['manuel', 'automatique', 'manuelle'],
    required: [true, 'Type de transmission requis'],
    lowercase: true
  },
  seats: {
    type: Number,
    required: [true, 'Nombre de sièges requis'],
    min: [2, 'Minimum 2 sièges'],
    max: [9, 'Maximum 9 sièges']
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  features: {
    type: [String],
    default: []
  },
  availability: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: 'Rabat, Maroc'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour recherches optimisées
carSchema.index({ brand: 1, type: 1 });
carSchema.index({ pricePerDay: 1 });
carSchema.index({ availability: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;
