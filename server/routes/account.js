// routes/users.js
import express from 'express';
import { 
  createUser, 
  loginUser, 
  getUsers, 
  updateUserRole, 
  deleteUser,
  createAdminUser,
  approveAdminUser,
  getPendingAdmins
} from '../controllers/userController.js';
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);
router.post('/login', loginUser);

// Route to get all users
router.get('/get-users', getUsers);

// Route to update user role
router.post('/update-role', updateUserRole);

// Route to delete a user
router.delete('/delete-user/:userID', deleteUser);

// Routes for admin registration and approval
router.post('/register-admin', createAdminUser);
router.post('/approve-admin', approveAdminUser);
router.get('/pending-admins', getPendingAdmins);

export default router;
