const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// Email configuration using Gmail
// SECURITY NOTE: For production, store credentials in environment variables
// and consider using OAuth2 or App Passwords instead of direct password
// You may need to enable "Less secure app access" in your Google account
// or generate an App Password if using 2-factor authentication
const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: 'mail.t-tech.cl', // Your SMTP server
    port: 465, // SMTP port (465 for SSL)
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'autorizaciones@t-tech.cl', // Your email address
      pass: 'fTGKzRSpjMAOdvjaBgOK' // Your email password
    },
    tls: {
      // You might need to add this if you get certificate errors
      rejectUnauthorized: false // Only for testing, remove in production
    }
  });

  return { transporter };
};

// Create a new user
const createUser = async (req, res) => {
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
      status: 'Pending'
    });

    // Notify admins about new user registration
    try {
      // Get all active admins
      const admins = await User.findAll({
        where: { role: 'Admin', status: 'Active' }
      });

      // Send notification email to all admins if any exist
      if (admins.length > 0) {
        const adminEmails = admins.map((admin) => admin.email);

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
                
                <a href="${process.env.APP_URL || 'https://t-tech.cl/dashboard'}/roles/usuarios" class="button">Ir al panel de usuarios</a>
                
                <div class="footer">
                  <p>Este es un mensaje automático, por favor no responda a este correo.</p>
                  <p>Gracias,<br>Equipo T-Tech</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await transporter.sendMail(mailOptions);
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
const createAdminUser = async (req, res) => {
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
      const adminEmails = admins.map((admin) => admin.email);

      // Create email transporter on demand
      const { transporter } = await createTransporter();

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
              
              <a href="${
                process.env.APP_URL || 'https://t-tech.cl/dashboard'
              }/roles/usuarios" class="button">Ir al panel de administración</a>
              
              <div class="footer">
                <p>Este es un mensaje automático, por favor no responda a este correo.</p>
                <p>Gracias,<br>Equipo T-Tech</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
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
const approveAdminUser = async (req, res) => {
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
    const { transporter } = await createTransporter();

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

      await transporter.sendMail(mailOptions);
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

      await transporter.sendMail(mailOptions);
      console.log('Rejection email sent to:', user.email);

      return res.status(200).json({ message: 'Usuario administrador rechazado y eliminado' });
    }
  } catch (error) {
    console.error('Error approving/rejecting admin:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pending admin users
const getPendingAdmins = async (req, res) => {
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
const updateUserRole = async (req, res) => {
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
const deleteUser = async (req, res) => {
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
const loginUser = async (req, res) => {
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

// Get pending non-admin users
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({
      where: {
        role: { [Op.ne]: 'Admin' },
        status: 'Pending'
      }
    });
    return res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve or reject regular user
const approveUser = async (req, res) => {
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
    const { transporter } = await createTransporter();

    if (approve) {
      user.status = 'Active';
      await user.save();

      // Send approval email to the user
      const mailOptions = {
        from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
        to: user.email,
        subject: 'Su cuenta ha sido aprobada - T-Tech',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
              .button { display: inline-block; background-color: #2196F3; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
              .footer { margin-top: 20px; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>¡Bienvenido a T-Tech!</h2>
            </div>
            <div class="content">
              <p>Estimado/a ${user.firstname} ${user.lastname},</p>
              
              <p>Nos complace informarle que su cuenta ha sido aprobada. Ya puede acceder a la plataforma T-Tech.</p>
              
              <p>Puede iniciar sesión en el siguiente enlace:</p>
              
              <a href="${process.env.APP_URL || 'https://t-tech.cl/dashboard'}/login" class="button">Iniciar Sesión</a>
              
              <div class="footer">
                <p>Este es un mensaje automático, por favor no responda a este correo.</p>
                <p>Gracias,<br>Equipo T-Tech</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
    } else {
      // Send rejection email
      const mailOptions = {
        from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
        to: user.email,
        subject: 'Solicitud de cuenta rechazada - T-Tech',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
              .footer { margin-top: 20px; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Solicitud Rechazada</h2>
            </div>
            <div class="content">
              <p>Estimado/a ${user.firstname} ${user.lastname},</p>
              
              <p>Lamentamos informarle que su solicitud de cuenta ha sido rechazada.</p>
              
              <p>Si considera que esto es un error, por favor contacte al administrador del sistema.</p>
              
              <div class="footer">
                <p>Este es un mensaje automático, por favor no responda a este correo.</p>
                <p>Gracias,<br>Equipo T-Tech</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      await user.destroy();
    }

    return res.status(200).json({ message: approve ? 'User approved successfully' : 'User rejected successfully' });
  } catch (error) {
    console.error('Error approving/rejecting user:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Generate a random 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // If user not found
    if (!user) {
      return res.status(404).json({
        error: 'No se encontró ninguna cuenta con este correo electrónico',
        type: 'email_not_found'
      });
    }

    // Generate a 6-digit reset code
    const resetCode = generateResetCode();

    // Store reset code and expiration time (30 minutes from now)
    user.resetCode = resetCode;
    user.resetCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    // Create email transporter
    const { transporter } = await createTransporter();

    // Send password reset email
    const mailOptions = {
      from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
      to: user.email,
      subject: 'Código de recuperación de contraseña - T-Tech',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .code-box { background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; text-align: center; letter-spacing: 5px; margin: 20px 0; font-weight: bold; }
            .warning { color: #f44336; font-style: italic; }
            .footer { margin-top: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Recuperación de Contraseña</h2>
          </div>
          <div class="content">
            <p>Estimado/a ${user.firstname} ${user.lastname},</p>
            
            <p>Recibimos una solicitud para restablecer la contraseña de su cuenta. Utilice el siguiente código para completar el proceso:</p>
            
            <div class="code-box">${resetCode}</div>
            
            <p>Este código expirará en 30 minutos.</p>
            
            <p class="warning">Si usted no solicitó este cambio, puede ignorar este correo y su contraseña permanecerá sin cambios.</p>
            
            <div class="footer">
              <p>Este es un mensaje automático, por favor no responda a este correo.</p>
              <p>Gracias,<br>Equipo T-Tech</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'Se ha enviado un código de recuperación a su correo electrónico',
      email: user.email
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Verify reset code and update password
const verifyResetCodeAndUpdatePassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // If user not found
    if (!user) {
      return res.status(404).json({
        error: 'No se encontró ninguna cuenta con este correo electrónico',
        type: 'email_not_found'
      });
    }

    // Check if reset code exists and is not expired
    if (!user.resetCode || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      return res.status(400).json({
        error: 'El código de recuperación ha expirado o es inválido',
        type: 'invalid_reset_code'
      });
    }

    // Verify reset code
    if (user.resetCode !== resetCode) {
      return res.status(400).json({
        error: 'El código de recuperación es incorrecto',
        type: 'invalid_reset_code'
      });
    }

    // Use the password directly as it's already hashed by the client
    // The client sends SHA256(password) which is the format we store in the database
    user.password = newPassword;
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    // Create email transporter
    const { transporter } = await createTransporter();

    // Send password change confirmation email
    const mailOptions = {
      from: '"T-Tech Notificaciones" <notifications@t-tech.cl>',
      to: user.email,
      subject: 'Confirmación de cambio de contraseña - T-Tech',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; background-color: #2196F3; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; }
            .security-note { background-color: #fff9c4; padding: 10px; border-radius: 5px; margin: 15px 0; }
            .footer { margin-top: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Contraseña Actualizada</h2>
          </div>
          <div class="content">
            <p>Estimado/a ${user.firstname} ${user.lastname},</p>
            
            <p>Su contraseña ha sido actualizada correctamente.</p>
            
            <p>Ya puede iniciar sesión con su nueva contraseña:</p>
            
            <a href="${process.env.APP_URL || 'https://t-tech.cl/dashboard'}/login" class="button">Iniciar Sesión</a>
            
            <div class="security-note">
              <p><strong>Nota de seguridad:</strong> Si usted no realizó este cambio, por favor contacte inmediatamente a nuestro equipo de soporte.</p>
            </div>
            
            <div class="footer">
              <p>Este es un mensaje automático, por favor no responda a este correo.</p>
              <p>Gracias,<br>Equipo T-Tech</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'Contraseña actualizada correctamente',
      success: true
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Verify reset code only (without updating password)
const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    // If user not found
    if (!user) {
      return res.status(404).json({
        error: 'No se encontró ninguna cuenta con este correo electrónico',
        type: 'email_not_found'
      });
    }

    // Check if reset code exists and is not expired
    if (!user.resetCode || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      return res.status(400).json({
        error: 'El código de recuperación ha expirado o es inválido',
        type: 'invalid_reset_code'
      });
    }

    // Verify reset code
    if (user.resetCode !== resetCode) {
      return res.status(400).json({
        error: 'El código de recuperación es incorrecto',
        type: 'invalid_reset_code'
      });
    }

    // Return success without updating password
    return res.status(200).json({
      message: 'Código verificado correctamente',
      success: true
    });
  } catch (error) {
    console.error('Error verifying reset code:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  createAdminUser,
  approveAdminUser,
  getUsers,
  getPendingAdmins,
  updateUserRole,
  deleteUser,
  loginUser,
  getPendingUsers,
  approveUser,
  requestPasswordReset,
  verifyResetCodeAndUpdatePassword,
  verifyResetCode
};
