import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Utilisateur requis']
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Voiture requise']
  },
  startDate: {
    type: Date,
    required: [true, 'Date de début requise']
  },
  endDate: {
    type: Date,
    required: [true, 'Date de fin requise']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Prix total requis'],
    min: [0, 'Prix doit être positif']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    trim: true
  },
  pickupLocation: {
    type: String,
    default: 'Tunis, Tunisie'
  },
  dropoffLocation: {
    type: String,
    default: 'Tunis, Tunisie'
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour recherches optimisées
reservationSchema.index({ userId: 1, status: 1 });
reservationSchema.index({ carId: 1, startDate: 1, endDate: 1 });

// Validation: Date de fin après date de début
reservationSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('Date de fin doit être après la date de début'));
  }
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
