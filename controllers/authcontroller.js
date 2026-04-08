require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Session = require('../models/session');
// Signup
const signup = async (req, res) => {
    try {
        const {email, password, location} = req.body;
        const existingUser = await User.findOne({where: {email}});
        if(existingUser) {
            return res.status(400).json({message: 'Email already registered'});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashPassword,
            location,
        });

        res.status(201).json({message: 'Account created successfully'});

    } catch (error) {
        console.error('SIGNUP ERROR:', error);
        res.status(500).json({ message: 'Signup failed', error: error.message });
}

};

// Login
const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Incorrect password'});
        }

        const token = jwt.sign(
            {id: user.id, email: user.email, location: user.location},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        await Session.create({
            userId: user.id,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.status(200).json({message: 'Login successful', token});

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({message: 'Login failed', error:error.message});
    }

};

const getUser = async (req, res) => {
    try {
        const session = await Session.findOne({where: {token: req.token}});
        if (!session) {
            return res.status(404).json({message: 'Session not found'});
        }

        const user = await User.findOne({where: {id: session.userId}});
        if (!user) {
           return res.status(404).json({message: 'User not found'}); 
        }

        res.status(200).json({
            id: user.id,
            emai: user.email,
            location: user.location,
            createdAt: user.createdAt,
        });

    } catch (error) {
        res.status(500).json({message: 'Could not retrive user', error: error.message});
    }
};

module.exports = {signup, login, getUser};
