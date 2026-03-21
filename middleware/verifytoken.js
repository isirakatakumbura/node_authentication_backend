const jwt = require('jsonwebtoken');
const Session = require('../models/session');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided'});
        }

        const token = authHeader.split('')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const session = await Session.findOne({where: { token }});
        if (!session) {
            return res.status(401).json({message: 'Session not found or expired'});
        }

        if (new Date() > new Date(session.expireAt)) {
            return res.status(401).json({message: 'Token has expired'});
        }

        req.token = token;
        req.user = decoded;

        next();

    } catch (error) {
        res.status(401).json({message: 'Invalid token', error: error.message});
    }
};

module.exports = verifyToken;