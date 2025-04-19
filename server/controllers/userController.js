import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Email configuration using Gmail
// SECURITY NOTE: For production, store credentials in environment variables
// and consider using OAuth2 or App Passwords instead of direct password
// You may need to enable "Less secure app access" in your Google account
// or generate an App Password if using 2-factor authentication
const createTransporter = async () => {
  // Create a test account with Ethereal Email - a fake SMTP service
  const testAccount = await nodemailer.createTestAccount();
  
  // Create a transporter using the test account's credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  
  return { 
    transporter, 
    previewUrl: () => null // No preview URL for real emails
  };
};

// Create a new user
export const createUser = async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  const { role } = req.query;

  // Hash the password using SHA-256
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Ya existe un usuario con este correo electrónico', 
        type: 'email_exists' 
      });
    }

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
        const { transporter } = await createTransporter();
        
        const mailOptions = {
          from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
          to: adminEmails.join(','),
          subject: 'Nuevo usuario registrado - T-Tech',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
                .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
                .user-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .button { display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
                .footer { margin-top: 20px; font-size: 12px; color: #777; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>Nuevo usuario registrado</h2>
              </div>
              <div class="content">
                <p>Un nuevo usuario se ha registrado en la plataforma T-Tech:</p>
                
                <div class="user-info">
                  <p><strong>Nombre:</strong> ${firstname} ${lastname}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Rol:</strong> ${role || 'User'}</p>
                  <p><strong>Fecha de registro:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <p>Puede ver todos los usuarios en el panel de administración:</p>
                
                <a href="${process.env.APP_URL || 'https://app.t-tech.cl'}/roles/usuarios" class="button">Ir al panel de usuarios</a>
                
                <div class="footer">
                  <p>Este es un mensaje automático, por favor no responda a este correo.</p>
                  <p>Gracias,<br>Equipo T-Tech</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin notification email sent to:', adminEmails.join(','));
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't break the registration process if email fails
    }

    console.log('New user created:', user);
    return res.status(200).json({ 
      user,
      message: 'Su solicitud ha sido enviada. Debe ser aprobada por un administrador existente.'
    });
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
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
              .user-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .button { display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
              .footer { margin-top: 20px; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Nueva solicitud de registro como Administrador</h2>
            </div>
            <div class="content">
              <p>Un nuevo usuario ha solicitado acceso como administrador en la plataforma T-Tech.</p>
              
              <div class="user-info">
                <p><strong>Nombre:</strong> ${firstname} ${lastname}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Fecha de solicitud:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p>Para aprobar o rechazar esta solicitud, inicie sesión en el panel de administración y vaya a la sección de <strong>Administración de roles y usuarios</strong>.</p>
              
              <a href="${process.env.APP_URL || 'https://app.t-tech.cl'}/roles/usuarios" class="button">Ir al panel de administración</a>
              
              <div class="footer">
                <p>Este es un mensaje automático, por favor no responda a este correo.</p>
                <p>Gracias,<br>Equipo T-Tech</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Admin request notification email sent to:', adminEmails.join(','));
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
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
              .button { display: inline-block; background-color: #f44336; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
              .footer { margin-top: 20px; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Solicitud de administrador aprobada</h2>
            </div>
            <div class="content">
              <p>Hola ${user.firstname},</p>
              <p>¡Felicitaciones! Su solicitud para ser administrador ha sido aprobada. Ahora puede iniciar sesión con todos los privilegios de administrador.</p>
              
              <a href="${process.env.APP_URL || 'https://app.t-tech.cl'}/auth/login" class="button">Iniciar sesión</a>
              
              <div class="footer">
                <p>Este es un mensaje automático, por favor no responda a este correo.</p>
                <p>Gracias,<br>Equipo T-Tech</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Approval email sent to:', user.email);
      
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
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
              .button { display: inline-block; background-color: #2196F3; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
              .footer { margin-top: 20px; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Solicitud de administrador rechazada</h2>
            </div>
            <div class="content">
              <p>Hola ${user.firstname},</p>
              <p>Lamentamos informarle que su solicitud para ser administrador ha sido rechazada.</p>
              <p>Si cree que esto es un error, por favor póngase en contacto con nuestro equipo de soporte o puede intentar registrarse nuevamente como usuario regular.</p>
              
              <a href="${process.env.APP_URL || 'https://app.t-tech.cl'}/auth/register" class="button">Registrarse como usuario regular</a>
              
              <div class="footer">
                <p>Este es un mensaje automático, por favor no responda a este correo.</p>
                <p>Gracias,<br>Equipo T-Tech</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Rejection email sent to:', user.email);
      
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
      return res.status(401).json({ 
        error: 'La cuenta no existe. Por favor regístrese primero.', 
        type: 'account_not_found' 
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ 
        error: 'Contraseña incorrecta', 
        type: 'invalid_password' 
      });
    }

    // Check if admin is pending approval
    if (user.role === 'Admin' && user.status === 'Pending') {
      return res.status(401).json({ 
        error: 'Su cuenta de administrador está pendiente de aprobación', 
        type: 'pending_approval' 
      });
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
