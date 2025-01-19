import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Create a new user
export const createUser = async (req, res) => {
  const { email, password } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  try {
    const user = await User.create({
      password: hashedPassword, // Use a hashed password in production
      role: 'User',
      email
    });

    console.log('New user created:', user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    // If user not found
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      {
        userId: user.userID,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return the token in the response
    return res.status(200).json({
      message: 'Login successful',
      token, // Send token to client
      user: {
        userID: user.userID,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: error.message });
  }
};
