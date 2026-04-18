const jwt = require('jsonwebtoken');
const Session = require('../models/session');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log('AUTH HEADER:', authHeader); // console
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided'});
        }

        const token = authHeader.split(' ')[1];
        console.log('TOKEN EXTRACTED:', token);
        console.log('JWT SECRET EXISTS:', !!process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('DECODED TOKEN:', decoded);

        const session = await Session.findOne({where: { token }});
        console.log('SESSION FOUND:', session ? 'yes' : 'no');
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
        console.error('VERIFY TOKEN ERROR:', error.message);
        res.status(401).json({message: 'Invalid token', error: error.message});
    }
};

module.exports = verifyToken;