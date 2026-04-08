// const {Sequelize} = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         dialect: 'mysql',
//         logging: false,
//     }
// );

// const connectDB = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log("MYSQL connected successfully");
//     } catch (error) {
//         console.log("Database Connection Failed:", error.message);
//         process.exit(1);
//     }
// };

// module.exports = { sequelize, connectDB };

const {Sequelize} = require('sequelize')
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            },
        },
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("MYSQL connected Successfully");
    } catch (error) {
        console.error('Database Connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB};