const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Create a new Sequelize instance to connect to MySQL
const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // Database name
  process.env.DATABASE_USERNAME, // Database username
  process.env.DATABASE_PASSWORD, // Database password
  {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql' // Specify MySQL as the dialect
  }
);

// Create an async function to test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized with models.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Call the function to test the connection
testConnection();

module.exports = sequelize;
