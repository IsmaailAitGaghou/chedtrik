import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Car from '../models/Car.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Charger les données des voitures
const loadCarsData = () => {
  // Essayer plusieurs emplacements possibles pour le fichier JSON
  const possiblePaths = [
    join(__dirname, '..', '..', 'data', 'cars_seed_data.json'), // data/ à la racine du projet
    join(__dirname, '..', 'data', 'cars_seed_data.json'), // data/ dans backend/
    join(__dirname, 'cars_seed_data.json'), // dans le même dossier que le script
  ];

  let carsDataPath = null;
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      carsDataPath = path;
      break;
    }
  }

  // Si le fichier n'existe pas, utiliser des données par défaut
  if (!carsDataPath) {
    console.warn('⚠️  Fichier cars_seed_data.json non trouvé. Utilisation de données par défaut.');
    return getDefaultCarsData();
  }

  try {
    const carsData = JSON.parse(fs.readFileSync(carsDataPath, 'utf-8'));
    
    // Transformer les données pour correspondre au schéma
    return carsData.map(car => ({
      name: car.name,
      brand: car.brand,
      model: car.name.split(' ').slice(1).join(' '),
      type: car.type.toLowerCase(),
      pricePerDay: car.price_per_day,
      fuel: car.fuel.toLowerCase(),
      transmission: car.transmission.toLowerCase() === 'manuelle' ? 'manuel' : car.transmission.toLowerCase(),
      seats: car.seats,
      images: car.images || [],
      description: car.description,
      features: [
        `${car.fuel}`,
        `${car.transmission}`,
        `${car.seats} places`,
        car.type
      ],
      availability: car.available !== undefined ? car.available : true,
      location: 'Rabat, Maroc'
    }));
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier JSON:', error.message);
    console.warn('⚠️  Utilisation de données par défaut.');
    return getDefaultCarsData();
  }
};

// Données par défaut si le fichier JSON n'existe pas
const getDefaultCarsData = () => {
  return [
    {
      name: 'Mercedes-Benz S-Class',
      brand: 'Mercedes-Benz',
      model: 'S-Class',
      type: 'berline',
      pricePerDay: 450,
      fuel: 'essence',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Luxury sedan with premium features and exceptional comfort',
      features: ['Premium Sound System', 'Leather Seats', 'Navigation', 'Parking Assist', 'Sunroof'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'BMW X5',
      brand: 'BMW',
      model: 'X5',
      type: 'suv',
      pricePerDay: 380,
      fuel: 'diesel',
      transmission: 'automatique',
      seats: 7,
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Premium SUV perfect for families and long journeys',
      features: ['7 Seats', 'All-Wheel Drive', 'Panoramic Roof', 'Premium Interior', 'Advanced Safety'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Audi A6',
      brand: 'Audi',
      model: 'A6',
      type: 'berline',
      pricePerDay: 320,
      fuel: 'essence',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Elegant sedan with cutting-edge technology and sporty design',
      features: ['Virtual Cockpit', 'Quattro AWD', 'Matrix LED', 'Premium Audio', 'Comfort Seats'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Range Rover Sport',
      brand: 'Land Rover',
      model: 'Range Rover Sport',
      type: 'suv',
      pricePerDay: 500,
      fuel: 'diesel',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1494976687768-f90e1a717a52?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Ultimate luxury SUV with off-road capabilities and refined elegance',
      features: ['Terrain Response', 'Meridian Sound', 'Air Suspension', 'Premium Leather', '360 Camera'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Porsche 911',
      brand: 'Porsche',
      model: '911',
      type: 'berline',
      pricePerDay: 600,
      fuel: 'essence',
      transmission: 'automatique',
      seats: 4,
      images: [
        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544829099-b9a0c53059e6?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Iconic sports car with legendary performance and timeless design',
      features: ['Sports Chrono', 'PASM', 'Premium Sound', 'Sport Seats', 'PDK Transmission'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Tesla Model S',
      brand: 'Tesla',
      model: 'Model S',
      type: 'berline',
      pricePerDay: 400,
      fuel: 'electrique',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Electric luxury sedan with autopilot and cutting-edge technology',
      features: ['Autopilot', 'Supercharging', 'Premium Interior', 'Panoramic Roof', '17" Touchscreen'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Lexus RX 350',
      brand: 'Lexus',
      model: 'RX 350',
      type: 'suv',
      pricePerDay: 350,
      fuel: 'hybride',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1494976687768-f90e1a717a52?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Luxury hybrid SUV with exceptional comfort and fuel efficiency',
      features: ['Hybrid Engine', 'Mark Levinson Audio', 'Panoramic Roof', 'Premium Leather', 'Safety System+'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Jaguar F-Pace',
      brand: 'Jaguar',
      model: 'F-Pace',
      type: 'suv',
      pricePerDay: 420,
      fuel: 'diesel',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494976687768-f90e1a717a52?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'British luxury SUV combining performance, elegance and practicality',
      features: ['All-Wheel Drive', 'Meridian Sound', 'Adaptive Dynamics', 'Premium Interior', 'Touch Pro'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Volvo XC90',
      brand: 'Volvo',
      model: 'XC90',
      type: 'suv',
      pricePerDay: 340,
      fuel: 'hybride',
      transmission: 'automatique',
      seats: 7,
      images: [
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Premium 7-seater SUV with Scandinavian design and advanced safety',
      features: ['7 Seats', 'Bowers & Wilkins', 'Pilot Assist', 'Crystal Gear Shifter', 'Air Suspension'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Mercedes-Benz GLE',
      brand: 'Mercedes-Benz',
      model: 'GLE',
      type: 'suv',
      pricePerDay: 400,
      fuel: 'diesel',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494976687768-f90e1a717a52?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Luxury mid-size SUV with MBUX infotainment and premium comfort',
      features: ['MBUX System', 'AIRMATIC', 'Burmester Sound', 'Panoramic Roof', 'AMG Line'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'BMW 5 Series',
      brand: 'BMW',
      model: '5 Series',
      type: 'berline',
      pricePerDay: 360,
      fuel: 'diesel',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Executive sedan with dynamic performance and luxurious interior',
      features: ['iDrive 7', 'Harman Kardon', 'Comfort Seats', 'Driving Assistant', 'Panoramic Roof'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Audi Q7',
      brand: 'Audi',
      model: 'Q7',
      type: 'suv',
      pricePerDay: 380,
      fuel: 'diesel',
      transmission: 'automatique',
      seats: 7,
      images: [
        'https://images.unsplash.com/photo-1494976687768-f90e1a717a52?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Premium 7-seater SUV with quattro all-wheel drive and advanced technology',
      features: ['7 Seats', 'Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen', 'Air Suspension'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Porsche Cayenne',
      brand: 'Porsche',
      model: 'Cayenne',
      type: 'suv',
      pricePerDay: 480,
      fuel: 'essence',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494976687768-f90e1a717a52?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Sports SUV combining Porsche performance with everyday practicality',
      features: ['PASM', 'Sport Chrono', 'Premium Sound', 'Panoramic Roof', 'PDK Transmission'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Mercedes-Benz E-Class',
      brand: 'Mercedes-Benz',
      model: 'E-Class',
      type: 'berline',
      pricePerDay: 320,
      fuel: 'diesel',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Executive sedan with intelligent drive and elegant design',
      features: ['MBUX', 'Burmester Sound', 'AIRMATIC', 'Comfort Seats', 'Driving Assistance'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'BMW 7 Series',
      brand: 'BMW',
      model: '7 Series',
      type: 'berline',
      pricePerDay: 500,
      fuel: 'hybride',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Flagship luxury sedan with ultimate comfort and advanced technology',
      features: ['Gesture Control', 'Bowers & Wilkins', 'Executive Lounge', 'Sky Lounge', 'Magic Body Control'],
      availability: true,
      location: 'Rabat, Maroc'
    },
    {
      name: 'Audi Q8',
      brand: 'Audi',
      model: 'Q8',
      type: 'suv',
      pricePerDay: 450,
      fuel: 'diesel',
      transmission: 'automatique',
      seats: 5,
      images: [
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=800&auto=format&fit=crop&q=80'
      ],
      description: 'Luxury coupe SUV with sporty design and quattro technology',
      features: ['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen', 'Air Suspension', 'Matrix LED'],
      availability: true,
      location: 'Rabat, Maroc'
    }
  ];
};

// Seed des voitures
const seedCars = async () => {
  try {
    // Supprimer les voitures existantes
    await Car.deleteMany({});
    console.log('✓ Anciennes voitures supprimées');

    // Charger et insérer les nouvelles voitures
    const carsData = loadCarsData();
    
    if (!carsData || carsData.length === 0) {
      throw new Error('Aucune donnée de voiture à insérer');
    }

    // Valider les données avant l'insertion
    const validatedCars = carsData.map(car => {
      // S'assurer que tous les champs requis sont présents
      if (!car.name || !car.brand || !car.type || !car.pricePerDay || !car.fuel || !car.transmission || !car.seats) {
        throw new Error(`Données de voiture invalides: ${JSON.stringify(car)}`);
      }
      return car;
    });

    await Car.insertMany(validatedCars, { ordered: false });
    console.log(`✓ ${validatedCars.length} voitures insérées avec succès`);
  } catch (error) {
    console.error('❌ Erreur lors du seed des voitures:', error.message);
    if (error.errors) {
      console.error('Détails des erreurs de validation:', error.errors);
    }
    throw error; // Relancer l'erreur pour arrêter le script
  }
};

// Créer un utilisateur admin par défaut
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@chedtri9.com' });
    
    if (!adminExists) {
      await User.create({
        email: 'admin@chedtri9.com',
        password: 'admin123',
        name: 'Administrateur ChedTri9',
        role: 'admin',
        phone: '+216 12 345 678',
        address: 'Tunis, Tunisie',
        isActive: true
      });
      console.log('Compte admin créé avec succès');
      console.log('Email: admin@chedtri9.com');
      console.log('Mot de passe: admin123');
    } else {
      console.log('Compte admin existe déjà');
    }
  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
  }
};

// Créer un utilisateur test par défaut
const createTestUser = async () => {
  try {
    const userExists = await User.findOne({ email: 'user@chedtri9.com' });
    
    if (!userExists) {
      await User.create({
        email: 'user@chedtri9.com',
        password: 'user123',
        name: 'Utilisateur Test',
        role: 'user',
        phone: '+216 98 765 432',
        address: 'Tunis, Tunisie',
        isActive: true
      });
      console.log('Compte utilisateur test créé avec succès');
      console.log('Email: user@chedtri9.com');
      console.log('Mot de passe: user123');
    } else {
      console.log('Compte utilisateur test existe déjà');
    }
  } catch (error) {
    console.error('Erreur lors de la création du compte utilisateur test:', error);
  }
};

// Fonction principale
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('\n=== Début du seed de la base de données ===\n');
    
    await seedCars();
    await createAdminUser();
    await createTestUser();
    
    console.log('\n=== Seed terminé avec succès ===\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur fatale lors du seed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Exécuter le seed
seedDatabase();
