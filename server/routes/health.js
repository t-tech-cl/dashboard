import sequelize from '../db/index.js';

const healthRoutes = async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    res.status(200).json({
      status: 'OK',
      message: 'Server is running and database connection is healthy'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Server is running but database connection failed',
      error: error.message
    });
  }
};

export default healthRoutes;
