const express = require('express');
const router = express.Router();
const { getAllTours } = require('../controllers/tourcontroller');
const verifyToken = require('../middleware/verifytoken');
const isAdmin = require('../middleware/isAdmin');

router.get('/', verifyToken, isAdmin, getAllTours);

module.exports = router;
