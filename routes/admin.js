const express = require('express');
const router = express.Router();
const {
  createAdmin,
  createUser,
  getAllUsers,
  activateUser,
  deactivateUser,
  changeRole,
} = require('../controllers/admincontroller');
const {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelcontroller');
const verifyToken = require('../middleware/verifytoken');
const isSuperAdmin = require('../middleware/isSuperadmin');
const isAdmin = require('../middleware/isAdmin');

// Superadmin only routes
router.post('/create-admin', verifyToken, isSuperAdmin, createAdmin);
router.patch('/users/:id/activate', verifyToken, isSuperAdmin, activateUser);
router.patch('/users/:id/deactivate', verifyToken, isSuperAdmin, deactivateUser);
router.patch('/users/:id/role', verifyToken, isSuperAdmin, changeRole);

// Superadmin and admin routes
router.post('/create-user', verifyToken, isAdmin, createUser);
router.get('/users', verifyToken, isAdmin, getAllUsers);

// Authenticated users can view hotels; only admins can manage them.
router.get('/hotels', verifyToken, getAllHotels);
router.get('/hotels/:id', verifyToken, getHotelById);
router.post('/hotels', verifyToken, isAdmin, createHotel);
router.put('/hotels/:id', verifyToken, isAdmin, updateHotel);
router.patch('/hotels/:id', verifyToken, isAdmin, updateHotel);
router.delete('/hotels/:id', verifyToken, isAdmin, deleteHotel);

module.exports = router;
