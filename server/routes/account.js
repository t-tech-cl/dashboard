// routes/users.js
const express = require('express');
const {
  createUser,
  loginUser,
  getUsers,
  updateUserRole,
  deleteUser,
  createAdminUser,
  approveAdminUser,
  getPendingAdmins,
  getPendingUsers,
  approveUser,
  requestPasswordReset,
  verifyResetCodeAndUpdatePassword,
  verifyResetCode
} = require('../controllers/userController.js');
const router = express.Router();

// Route to create a new user
router.post('/register', createUser);
router.post('/login', loginUser);

// Route to get all users
router.get('/get-users', getUsers);

// Route to get pending admin users
router.get('/pending-admins', getPendingAdmins);

// Route to get pending non-admin users
router.get('/pending-users', getPendingUsers);

// Route to approve/reject admin user
router.post('/approve-admin', approveAdminUser);

// Route to approve/reject regular user
router.post('/approve-user', approveUser);

// Route to update user role
router.post('/update-role', updateUserRole);

// Route to delete a user
router.delete('/delete-user/:userID', deleteUser);

// Routes for admin registration and approval
router.post('/register-admin', createAdminUser);

// Routes for password recovery
router.post('/request-password-reset', requestPasswordReset);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', verifyResetCodeAndUpdatePassword);

module.exports = router;
