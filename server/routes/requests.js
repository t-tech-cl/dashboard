// routes/requests.js
import express from 'express';
import { createRequest, generateRequestPDF, getRequests } from '../controllers/requestController.js';
import { getLastRequestNumber } from '../controllers/requestController.js';

const router = express.Router();

// Route to create a new request
router.post('/create', createRequest);

// Route to get all requests
router.get('/get-request', getRequests);
// Route to create the PDF
router.get('/generate-pdf', generateRequestPDF);

// Route to get the last request
router.get('/get-last', getLastRequestNumber);

export default router;
