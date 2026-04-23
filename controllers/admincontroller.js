require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// CREATE ADMIN - superadmin only
const createAdmin = async(req, res) =>  {
    try {
        const {email, password, location} = req.body;

        const existingUser = await User.findOne({where: {email}});
        if(existingUser) {
            return res.status(400).json({message: 'Email already registered'});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newAdmin = await User.create({
            email,
            password: hashPassword,
            location,
            role: 'admin',
            isActive: true,
        });

        res.status(201).json({
            message: 'Admin account created successfully',
            admin: {
                id: newAdmin.id,
                email: newAdmin.email,
                location: newAdmin.location,
                role: newAdmin.role,
            }
        });
    } catch (error) {
        console.error('CREATE ADMIN ERROR', error);
        res.status(500).json({message: 'Failed to create admin', error:error.message});
    }
};

// CREATE USER — superadmin and admin
const createUser = async (req, res) => {
  try {
    const { email, password, location } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const newUser = await User.create({
      email,
      password: hashedPassword,
      location,
      role: 'user',
      isActive: true,
    });

    res.status(201).json({ 
      message: 'User account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        location: newUser.location,
        role: newUser.role,
      }
    });

  } catch (error) {
    console.error('CREATE USER ERROR:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

// GET ALL USERS — superadmin and admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'location', 'role', 'isActive', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ users });

  } catch (error) {
    console.error('GET ALL USERS ERROR:', error);
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};

// ACTIVATE USER — superadmin only
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent modifying superadmin account
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify superadmin account' });
    }

    await User.update(
      { isActive: true },
      { where: { id } }
    );

    res.status(200).json({ message: 'User account activated successfully' });

  } catch (error) {
    console.error('ACTIVATE USER ERROR:', error);
    res.status(500).json({ message: 'Failed to activate user', error: error.message });
  }
};

// DEACTIVATE USER — superadmin only
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent modifying superadmin account
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify superadmin account' });
    }

    await User.update(
      { isActive: false },
      { where: { id } }
    );

    res.status(200).json({ message: 'User account deactivated successfully' });

  } catch (error) {
    console.error('DEACTIVATE USER ERROR:', error);
    res.status(500).json({ message: 'Failed to deactivate user', error: error.message });
  }
};

// CHANGE USER ROLE — superadmin only
const changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role value
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be admin or user.' });
    }

    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent modifying superadmin account
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify superadmin account' });
    }

    await User.update(
      { role },
      { where: { id } }
    );

    res.status(200).json({ message: `User role updated to ${role} successfully` });

  } catch (error) {
    console.error('CHANGE ROLE ERROR:', error);
    res.status(500).json({ message: 'Failed to change role', error: error.message });
  }
};

module.exports = { 
  createAdmin, 
  createUser, 
  getAllUsers, 
  activateUser, 
  deactivateUser, 
  changeRole 
};