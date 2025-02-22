// routes/requests.js
import express from 'express';
import {
  createRequest,
  getAllRequests,
  getRequest,
  getLastRequestNumber,
  getAll,
  getAllExternalReports
} from '../controllers/requestController.js';

const router = express.Router();

// Route to create a new request
router.post('/create', createRequest);
router.get('/get-request', getRequest);

// Route to get all requests
router.get('/get-all-requests', getAllRequests);
router.get('/get-all', getAll);
router.get('/get-all-external-reports', getAllExternalReports);

// Route to get the last request
router.get('/get-last', getLastRequestNumber);

export default router;
