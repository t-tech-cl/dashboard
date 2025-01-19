// routes/requests.js
import express from 'express';
import { createRequest, getRequests } from '../controllers/requestController.js';
import { getLastRequestNumber } from '../controllers/requestController.js';

const router = express.Router();

// Route to create a new request
router.post('/create', createRequest);

// Route to get all requests
router.get('/get-request', getRequests);

//
router.get('/get-last', getLastRequestNumber);

export default router;
