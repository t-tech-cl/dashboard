// routes/users.js
import express from 'express';
import { createUser, loginUser, getUsers } from '../controllers/userController.js';
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);
router.post('/login', loginUser);

// Route to get all users
router.get('/get-users', getUsers);

export default router;
