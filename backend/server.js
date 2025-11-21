import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import des routes
import authRoutes from './routes/auth.js';
import carRoutes from './routes/cars.js';
import reservationRoutes from './routes/reservations.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

// Initialiser l'application Express
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ChedTri9 API est en ligne',
    timestamp: new Date().toISOString()
  });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API ChedTri9',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      cars: '/api/cars',
      reservations: '/api/reservations',
      payments: '/api/payments',
      admin: '/api/admin'
    }
  });
});

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrer le serveur
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`
╔══════════════════════════════════════════╗
║                                          ║
║        Serveur ChedTri9 démarré          ║
║                                          ║
║  Environnement: ${process.env.NODE_ENV || 'development'}${' '.repeat(20 - (process.env.NODE_ENV || 'development').length)}║
║  Port: ${PORT}${' '.repeat(34 - PORT.toString().length)}║
║  API disponible sur:                     ║
║  http://localhost:${PORT}${' '.repeat(21 - PORT.toString().length)}║
║                                          ║
╚══════════════════════════════════════════╝
  `);
});

// Gestion des erreurs non gérées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  server.close(() => process.exit(1));
});

export default app;
