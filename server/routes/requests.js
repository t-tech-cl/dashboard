// routes/requests.js
import express from 'express';
import { createRequest, generateRequestPDF, getAllRequests, getRequest, getLastRequestNumber } from '../controllers/requestController.js';

const router = express.Router();

// Route to create a new request
router.post('/create', createRequest);
router.get('/get-request', getRequest);

// Route to get all requests
router.get('/get-all-requests', getAllRequests);
// Route to create the PDF
router.get('/generate-pdf', generateRequestPDF);

// Route to get the last request
router.get('/get-last', getLastRequestNumber);

export default router;
