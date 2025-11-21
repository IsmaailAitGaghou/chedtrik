import Reservation from '../models/Reservation.js';
import Car from '../models/Car.js';

// @desc    Créer une réservation
// @route   POST /api/reservations
// @access  Private
export const createReservation = async (req, res) => {
  try {
    const { carId, startDate, endDate, totalPrice, pickupLocation, dropoffLocation, customerInfo } = req.body;

    // Vérifier que la voiture existe
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Voiture non trouvée'
      });
    }

    // Vérifier la disponibilité de la voiture
    if (!car.availability) {
      return res.status(400).json({
        success: false,
        message: 'Voiture non disponible'
      });
    }

    // Vérifier qu'il n'y a pas de chevauchement de réservations
    const existingReservations = await Reservation.find({
      carId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
      ]
    });

    if (existingReservations.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Voiture déjà réservée pour ces dates'
      });
    }

    // Créer la réservation
    const reservation = await Reservation.create({
      userId: req.user._id,
      carId,
      startDate,
      endDate,
      totalPrice,
      pickupLocation: pickupLocation || 'Rabat, Maroc',
      dropoffLocation: dropoffLocation || 'Rabat, Maroc',
      customerInfo: customerInfo || {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      }
    });

    // Populer les données de la voiture
    await reservation.populate('carId');

    res.status(201).json({
      success: true,
      reservation: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir toutes les réservations (Admin) ou mes réservations (User)
// @route   GET /api/reservations
// @access  Private
export const getReservations = async (req, res) => {
  try {
    let filter = {};

    // Si l'utilisateur n'est pas admin, afficher seulement ses réservations
    if (req.user.role !== 'admin') {
      filter.userId = req.user._id;
    }

    // Filtres supplémentaires
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const reservations = await Reservation.find(filter)
      .populate('carId')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir une réservation par ID
// @route   GET /api/reservations/:id
// @access  Private
export const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('carId')
      .populate('userId', 'name email phone');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur a accès à cette réservation
    if (req.user.role !== 'admin' && reservation.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mettre à jour une réservation
// @route   PUT /api/reservations/:id
// @access  Private
export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur a accès à cette réservation
    if (req.user.role !== 'admin' && reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    // Mettre à jour
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('carId').populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      data: updatedReservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Annuler une réservation
// @route   PATCH /api/reservations/:id/cancel
// @access  Private
export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur a accès à cette réservation
    if (req.user.role !== 'admin' && reservation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }

    // Vérifier que la réservation peut être annulée
    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cette réservation ne peut pas être annulée'
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Réservation annulée avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Supprimer une réservation
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Réservation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirmer une réservation après paiement
// @route   PATCH /api/reservations/:id/confirm
// @access  Private
export const confirmReservation = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    reservation.status = 'confirmed';
    reservation.paymentId = paymentId;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Réservation confirmée avec succès',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Obtenir statistiques des réservations (Admin)
// @route   GET /api/reservations/stats
// @access  Private/Admin
export const getReservationStats = async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmed' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });
    const completedReservations = await Reservation.countDocuments({ status: 'completed' });

    // Revenus totaux
    const revenueData = await Reservation.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalReservations,
        pendingReservations,
        confirmedReservations,
        cancelledReservations,
        completedReservations,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
