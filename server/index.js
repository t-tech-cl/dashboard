// index.js
const express = require('express');
const dotenv = require('dotenv');
const accountRoutes = require('./routes/account.js');
const requestRoutes = require('./routes/requests.js');
const healthRoutes = require('./routes/health.js');

dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
  next();
});

app.use('/api/account', accountRoutes);
app.use('/api/requests', requestRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.NODE_PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;
