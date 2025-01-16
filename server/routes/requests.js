// routes/requests.js
import express from 'express';
import { createRequest, getRequests } from '../controllers/requestController.js';
const router = express.Router();

// Route to create a new request
router.post('/', createRequest);

// Route to get all requests
router.get('/', getRequests);

export default router;
