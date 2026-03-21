const express = require('express');
const router = express.Router();
const {signup, login, getUser} = require('../controllers/authcontroller');
const verifyToken = require('../middleware/verifytoken');
const { sign } = require('jsonwebtoken');

router.post('/signup', signup);
router.post('/login', login);

router.get('/user', verifyToken, getUser);

module.exports = router;