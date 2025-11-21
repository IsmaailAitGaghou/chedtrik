import Car from '../models/Car.js';

// @desc    Obtenir toutes les voitures avec filtres
// @route   GET /api/cars
// @access  Public
export const getCars = async (req, res) => {
  try {
    const { brand, type, minPrice, maxPrice, fuel, transmission, seats, available, limit, location } = req.query;

    // Construire le filtre
    let filter = {};

    if (brand) filter.brand = new RegExp(brand, 'i');
    if (type) filter.type = type.toLowerCase();
    if (fuel) filter.fuel = fuel.toLowerCase();
    if (transmission) filter.transmission = transmission.toLowerCase();
    if (seats) filter.seats = parseInt(seats);
    if (available !== undefined) filter.availability = available === 'true';
    if (location) filter.location = new RegExp(location, 'i');

    // Filtre de prix
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = parseFloat(maxPrice);
    }

    let query = Car.find(filter).sort({ createdAt: -1 });
    
    // Limiter le nombre de résultats si spécifié
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const cars = await query;

    res.status(200).json({
      success: true,
      count: cars.length,
      cars: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir une voiture par ID
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      car: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Créer une nouvelle voiture
// @route   POST /api/cars
// @access  Private/Admin
export const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour une voiture
// @route   PUT /api/cars/:id
// @access  Private/Admin
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer une voiture
// @route   DELETE /api/cars/:id
// @access  Private/Admin
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Voiture supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les types de voitures disponibles
// @route   GET /api/cars/types
// @access  Public
export const getCarTypes = async (req, res) => {
  try {
    const types = await Car.distinct('type');

    res.status(200).json({
      success: true,
      types: types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir les marques de voitures disponibles
// @route   GET /api/cars/brands
// @access  Public
export const getCarBrands = async (req, res) => {
  try {
    const brands = await Car.distinct('brand');

    res.status(200).json({
      success: true,
      brands: brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
