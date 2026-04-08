const express = require('express');
const path = require('path');
const {connectDB, sequelize} = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({alter: false});
        console.log('Databse tables synced');

        app.listen(PORT, () => {
            console.log('Server running on http://localhost:${PORT}');
        });
    
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.getMaxListeners(1);
    }
};

startServer();