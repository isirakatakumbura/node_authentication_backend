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

module.exports = router;