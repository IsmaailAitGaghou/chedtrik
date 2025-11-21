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

// Middlewares - CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://chedtrik.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean).map(url => {
      // Remove trailing slashes for consistent matching
      return url.replace(/\/$/, '');
    });
    
    // Normalize the origin (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      // In development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

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
