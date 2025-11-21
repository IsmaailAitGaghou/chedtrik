# ChedTri9 Backend API

API RESTful pour la plateforme de location de voitures ChedTri9, construite avec Express.js, Node.js et MongoDB.

## Technologies

- **Express.js** - Framework web Node.js
- **MongoDB Atlas** - Base de données NoSQL
- **Mongoose** - ODM MongoDB
- **JWT** - Authentification avec JSON Web Tokens
- **bcryptjs** - Hashage des mots de passe
- **PayPal SDK** - Intégration des paiements
- **CORS** - Gestion des requêtes cross-origin

## Prérequis

- Node.js >= 16.x
- npm ou yarn
- Compte MongoDB Atlas (gratuit)
- Compte PayPal Developer (pour paiements)

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Créer un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

2. Configurer les variables d'environnement dans `.env`:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chedtri9?retryWrites=true&w=majority

# Serveur
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_securise_ici
JWT_EXPIRE=7d

# PayPal
PAYPAL_CLIENT_ID=votre_paypal_client_id
PAYPAL_CLIENT_SECRET=votre_paypal_client_secret
PAYPAL_MODE=sandbox

# CORS
FRONTEND_URL=http://localhost:5173
```

### Obtenir MongoDB Atlas URI

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un nouveau cluster (gratuit)
3. Créer un utilisateur de base de données
4. Obtenir la chaîne de connexion
5. Remplacer `<username>` et `<password>` dans l'URI

### Obtenir les credentials PayPal

1. Créer un compte sur [PayPal Developer](https://developer.paypal.com)
2. Aller dans "Dashboard" > "My Apps & Credentials"
3. Créer une nouvelle app dans l'environnement Sandbox
4. Copier le Client ID et le Secret

## Seed de la base de données

Insérer les 25 voitures et créer les comptes admin/user par défaut:

```bash
npm run seed
```

Comptes créés automatiquement:
- **Admin**: admin@chedtri9.com / admin123
- **User**: user@chedtri9.com / user123

## Démarrage

### Développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

### Production

```bash
npm start
```

## Routes API

### Authentification (`/api/auth`)

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur (protégé)
- `PUT /api/auth/profile` - Mettre à jour profil (protégé)

### Voitures (`/api/cars`)

- `GET /api/cars` - Liste des voitures (avec filtres)
- `GET /api/cars/:id` - Détails d'une voiture
- `GET /api/cars/types` - Types disponibles
- `GET /api/cars/brands` - Marques disponibles
- `POST /api/cars` - Créer une voiture (admin)
- `PUT /api/cars/:id` - Mettre à jour une voiture (admin)
- `DELETE /api/cars/:id` - Supprimer une voiture (admin)

### Réservations (`/api/reservations`)

- `POST /api/reservations` - Créer une réservation (protégé)
- `GET /api/reservations` - Liste des réservations (protégé)
- `GET /api/reservations/stats` - Statistiques (admin)
- `GET /api/reservations/:id` - Détails d'une réservation (protégé)
- `PUT /api/reservations/:id` - Mettre à jour une réservation (protégé)
- `PATCH /api/reservations/:id/cancel` - Annuler une réservation (protégé)
- `PATCH /api/reservations/:id/confirm` - Confirmer une réservation (protégé)
- `DELETE /api/reservations/:id` - Supprimer une réservation (admin)

### Paiements (`/api/payments`)

- `POST /api/payments/create-order` - Créer un ordre PayPal (protégé)
- `POST /api/payments/capture-order` - Capturer un paiement (protégé)
- `GET /api/payments/order/:orderId` - Détails d'un ordre (protégé)
- `POST /api/payments/refund` - Rembourser un paiement (admin)

### Admin (`/api/admin`)

- `GET /api/admin/users` - Liste des utilisateurs (admin)
- `GET /api/admin/users/:id` - Détails d'un utilisateur (admin)
- `PUT /api/admin/users/:id` - Mettre à jour un utilisateur (admin)
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur (admin)
- `PATCH /api/admin/users/:id/toggle-status` - Activer/désactiver (admin)

## Format des Requêtes

### Inscription

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+216 12 345 678",
  "address": "Tunis, Tunisie"
}
```

### Connexion

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Créer une réservation

```json
POST /api/reservations
Headers: { "Authorization": "Bearer <token>" }
{
  "carId": "65abc123...",
  "startDate": "2025-11-01",
  "endDate": "2025-11-05",
  "totalPrice": 350.00,
  "pickupLocation": "Tunis, Tunisie",
  "dropoffLocation": "Tunis, Tunisie"
}
```

## Structure du Projet

```
backend/
├── config/
│   └── database.js          # Configuration MongoDB
├── controllers/
│   ├── authController.js    # Logique authentification
│   ├── carController.js     # Logique voitures
│   ├── reservationController.js  # Logique réservations
│   ├── paymentController.js # Logique paiements
│   └── adminController.js   # Logique admin
├── middleware/
│   ├── auth.js             # Middleware JWT
│   └── errorHandler.js     # Gestion erreurs
├── models/
│   ├── User.js             # Modèle utilisateur
│   ├── Car.js              # Modèle voiture
│   └── Reservation.js      # Modèle réservation
├── routes/
│   ├── auth.js             # Routes authentification
│   ├── cars.js             # Routes voitures
│   ├── reservations.js     # Routes réservations
│   ├── payments.js         # Routes paiements
│   └── admin.js            # Routes admin
├── scripts/
│   └── seedDatabase.js     # Script seed DB
├── .env.example            # Exemple configuration
├── server.js               # Point d'entrée
└── package.json
```

## Sécurité

- Mots de passe hashés avec bcryptjs (10 rounds)
- Authentification JWT avec expiration
- Validation des données côté serveur
- Protection CORS configurée
- Middleware de protection des routes
- Gestion des rôles (user/admin)

## Gestion des Erreurs

Toutes les erreurs sont formatées de manière cohérente:

```json
{
  "success": false,
  "message": "Description de l'erreur"
}
```

## Tests avec Postman/Thunder Client

1. Importer la collection dans `docs/api-collection.json` (si disponible)
2. Créer un environnement avec:
   - `baseURL`: http://localhost:3001
   - `token`: (obtenu après login)

## Déploiement

### Heroku

```bash
heroku create chedtri9-api
git push heroku main
heroku config:set MONGODB_URI=... JWT_SECRET=... PAYPAL_CLIENT_ID=...
```

### Railway

1. Connecter le dépôt GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Render

1. Créer un nouveau Web Service
2. Configurer les variables d'environnement
3. Déployer

## Support

Pour toute question ou problème, contacter l'équipe ChedTri9.

## Licence

MIT
