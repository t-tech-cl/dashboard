import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

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

sequelize
  .sync({ alter: true }) // Sync the models with the database
  .then(() => {
    console.log('Database updated!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Create an async function to test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Call the function to test the connection
testConnection();

export default sequelize;
