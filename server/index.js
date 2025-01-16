// index.js
import express from 'express';
import dotenv from 'dotenv';
import accountRoutes from './routes/account.js';
import requestRoutes from './routes/requests.js';
import healthRoutes from './routes/health.js';

dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON request bodies

app.use('/api/account', accountRoutes);
app.use('/api/requests', requestRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.NODE_PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
