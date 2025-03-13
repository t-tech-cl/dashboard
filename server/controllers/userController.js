import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Email configuration - using ethereal email for testing (no credentials required)
const createTransporter = async () => {
  // Create a test account with Ethereal Email - a fake SMTP service
  const testAccount = await nodemailer.createTestAccount();
  
  // Create a transporter using the test account's credentials
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  
  return { transporter, previewUrl: (info) => nodemailer.getTestMessageUrl(info) };
};

// Create a new user
export const createUser = async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  const { role } = req.query;

  // Hash the password using SHA-256
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  try {
    const user = await User.create({
      password: hashedPassword,
      role: role || 'User',
      firstname,
      lastname,
      email,
      status: 'Active'
    });

    // Notify admins about new user registration
    try {
      // Get all active admins
      const admins = await User.findAll({
        where: { role: 'Admin', status: 'Active' }
      });

      // Send notification email to all admins if any exist
      if (admins.length > 0) {
        const adminEmails = admins.map(admin => admin.email);
        
        // Create email transporter on demand
        const { transporter, previewUrl } = await createTransporter();
        
        const mailOptions = {
          from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
          to: adminEmails.join(','),
          subject: 'Nuevo usuario registrado - T-Tech',
          html: `
            <h2>Nuevo usuario registrado</h2>
            <p>Un nuevo usuario se ha registrado en la plataforma:</p>
            <p><strong>Nombre:</strong> ${firstname} ${lastname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Rol:</strong> ${role || 'User'}</p>
            <p>Gracias,<br>Equipo T-Tech</p>
          `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin notification email sent. Preview URL: %s', previewUrl(info));
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't break the registration process if email fails
    }

    console.log('New user created:', user);
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Create an admin user (with approval required)
export const createAdminUser = async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  
  // Hash the password
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  try {
    // Create user with pending status
    const user = await User.create({
      password: hashedPassword,
      role: 'Admin',
      firstname,
      lastname,
      email,
      status: 'Pending'
    });

    // Get all existing admins
    const admins = await User.findAll({
      where: { role: 'Admin', status: 'Active' }
    });

    // Send notification email to all admins
    if (admins.length > 0) {
      const adminEmails = admins.map(admin => admin.email);
      
      // Create email transporter on demand
      const { transporter, previewUrl } = await createTransporter();
      
      const mailOptions = {
        from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
        to: adminEmails.join(','),
        subject: 'Nueva solicitud de administrador - T-Tech',
        html: `
          <h2>Nueva solicitud de registro como Administrador</h2>
          <p>Un nuevo usuario ha solicitado acceso como administrador:</p>
          <p><strong>Nombre:</strong> ${firstname} ${lastname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p>Inicie sesión en el panel de administración para aprobar o rechazar esta solicitud.</p>
          <p>Gracias,<br>Equipo T-Tech</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent. Preview URL: %s', previewUrl(info));
    }

    return res.status(200).json({ 
      user,
      message: 'Solicitud de administrador enviada. Debe ser aprobada por un administrador existente.'
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Approve or reject admin user
export const approveAdminUser = async (req, res) => {
  const { userID, approve } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Verify token and check if user is admin
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized: Only administrators can approve users' });
    }

    // Find user by ID
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create email transporter on demand
    const { transporter, previewUrl } = await createTransporter();

    if (approve) {
      user.status = 'Active';
      await user.save();
      
      // Send approval email to the user
      const mailOptions = {
        from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
        to: user.email,
        subject: 'Su cuenta de administrador ha sido aprobada - T-Tech',
        html: `
          <h2>Solicitud de administrador aprobada</h2>
          <p>Hola ${user.firstname},</p>
          <p>Su solicitud para ser administrador ha sido aprobada. Ahora puede iniciar sesión con todos los privilegios de administrador.</p>
          <p>Gracias,<br>Equipo T-Tech</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Approval email sent. Preview URL: %s', previewUrl(info));
      
      return res.status(200).json({ message: 'Usuario administrador aprobado', user });
    } else {
      // Delete the user if not approved
      await user.destroy();
      
      // Send rejection email
      const mailOptions = {
        from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
        to: user.email,
        subject: 'Su solicitud de administrador ha sido rechazada - T-Tech',
        html: `
          <h2>Solicitud de administrador rechazada</h2>
          <p>Hola ${user.firstname},</p>
          <p>Lamentamos informarle que su solicitud para ser administrador ha sido rechazada.</p>
          <p>Si cree que esto es un error, por favor póngase en contacto con nuestro equipo de soporte.</p>
          <p>Gracias,<br>Equipo T-Tech</p>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Rejection email sent. Preview URL: %s', previewUrl(info));
      
      return res.status(200).json({ message: 'Usuario administrador rechazado y eliminado' });
    }
  } catch (error) {
    console.error('Error approving/rejecting admin:', error);
    return res.status(500).json({ error: error.message });
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

// Get pending admin users
export const getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.findAll({
      where: { role: 'Admin', status: 'Pending' }
    });
    return res.status(200).json(pendingAdmins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  const { userID, role } = req.body;
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Verify token and check if user is admin
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized: Only administrators can update roles' });
    }

    // Find user by ID
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user role
    user.role = role;
    await user.save();

    return res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { userID } = req.params;
  const token = req.headers.authorization.split(' ')[1];

  try {
    // Verify token and check if user is admin
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized: Only administrators can delete users' });
    }

    // Find user by ID
    const user = await User.findByPk(userID);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deletion of the last admin
    const adminCount = await User.count({ where: { role: 'Admin', status: 'Active' } });
    if (user.role === 'Admin' && adminCount <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last administrator' });
    }

    // Delete the user
    await user.destroy();

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all users
export const loginUser = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
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

    // Check if admin is pending approval
    if (user.role === 'Admin' && user.status === 'Pending') {
      return res.status(401).json({ error: 'Your administrator account is pending approval' });
    }

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      {
        userID: user.userID,
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname
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
