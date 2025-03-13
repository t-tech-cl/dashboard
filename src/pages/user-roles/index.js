import React, { useEffect, useState } from 'react';
import { ACCOUNT_ENDPOINTS } from 'const/urls';
import axiosServices from 'utils/axios';
import { 
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Stack,
  Grid,
  Avatar,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MainCard from 'components/MainCard';
import { 
  TeamOutlined, 
  UserSwitchOutlined, 
  LockOutlined, 
  SafetyCertificateOutlined,
  UserAddOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  MailOutlined,
  PlusOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import useAuth from 'hooks/useAuth';

const UserRoles = () => {
  const [users, setUsers] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'User'
  });
  
  const { user } = useAuth();

  // Check if user is admin and redirect if not
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      setSnackbar({
        open: true,
        message: 'Acceso restringido solo para administradores',
        severity: 'error'
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch active users
        const usersResponse = await axiosServices.get(ACCOUNT_ENDPOINTS.GET_USERS);
        setUsers(usersResponse.data);
        
        // Fetch pending admin requests
        if (user && user.role === 'Admin') {
          const pendingResponse = await axiosServices.get(ACCOUNT_ENDPOINTS.PENDING_ADMINS);
          setPendingAdmins(pendingResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Error al cargar los datos',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosServices.post(ACCOUNT_ENDPOINTS.UPDATE_USER_ROLE, {
        userID: userId,
        role: newRole
      });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.userID === userId ? { ...user, role: newRole } : user
        )
      );
      
      setSnackbar({
        open: true,
        message: `Rol de usuario actualizado correctamente a ${newRole}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al actualizar el rol',
        severity: 'error'
      });
    }
  };

  const handleAddUser = async () => {
    try {
      // Validate form
      if (!newUser.firstname || !newUser.lastname || !newUser.email || !newUser.password) {
        setSnackbar({
          open: true,
          message: 'Por favor, complete todos los campos',
          severity: 'error'
        });
        return;
      }
      
      const response = await axiosServices.post(ACCOUNT_ENDPOINTS.REGISTER, newUser);
      
      // Add the new user to the list
      setUsers(prevUsers => [...prevUsers, response.data.user]);
      
      // Close dialog and reset form
      setOpenAddDialog(false);
      setNewUser({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'User'
      });
      
      setSnackbar({
        open: true,
        message: 'Usuario creado correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error creating user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al crear el usuario',
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axiosServices.delete(`${ACCOUNT_ENDPOINTS.DELETE_USER}/${userId}`);
      
      // Update local state by removing the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.userID !== userId));
      
      // Close modal if the deleted user was selected
      if (selectedUser && selectedUser.userID === userId) {
        setSelectedUser(null);
      }
      
      setSnackbar({
        open: true,
        message: 'Usuario eliminado correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al eliminar el usuario',
        severity: 'error'
      });
    }
  };

  const handleApproveAdmin = async (userId, approve) => {
    try {
      await axiosServices.post(ACCOUNT_ENDPOINTS.APPROVE_ADMIN, {
        userID: userId,
        approve
      });
      
      // Update local state by removing the approved/rejected admin
      setPendingAdmins(prevAdmins => prevAdmins.filter(admin => admin.userID !== userId));
      
      // If approved, add to active users list
      if (approve) {
        const approvedAdmin = pendingAdmins.find(admin => admin.userID === userId);
        if (approvedAdmin) {
          approvedAdmin.status = 'Active';
          setUsers(prevUsers => [...prevUsers, approvedAdmin]);
        }
      }
      
      setSnackbar({
        open: true,
        message: approve ? 'Administrador aprobado correctamente' : 'Solicitud rechazada',
        severity: approve ? 'success' : 'info'
      });
    } catch (error) {
      console.error('Error approving/rejecting admin:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Error al procesar la solicitud',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getRoleChip = (role, status) => {
    let color;
    let icon;
    
    if (status === 'Pending') {
      return (
        <Chip 
          icon={<ExclamationCircleOutlined />}
          label="Pendiente" 
          color="warning" 
          size="small"
          sx={{ fontWeight: 'bold' }}
        />
      );
    }
    
    switch (role) {
      case 'Admin':
        color = 'error';
        icon = <SafetyCertificateOutlined />;
        break;
      case 'Manager':
        color = 'warning';
        icon = <LockOutlined />;
        break;
      default:
        color = 'primary';
        icon = <TeamOutlined />;
    }
    
    return (
      <Chip 
        icon={icon}
        label={role} 
        color={color} 
        size="small"
        sx={{ fontWeight: 'bold' }}
      />
    );
  };

  const filteredUsers = searchTerm 
    ? users.filter(user => 
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  // Card variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <UserSwitchOutlined style={{ marginRight: '12px', fontSize: '1.2em' }} />
          Administración de roles y usuarios
        </Typography>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="user management tabs">
            <Tab 
              label="Usuarios Activos" 
              icon={<TeamOutlined />} 
              iconPosition="start"
            />
            {user && user.role === 'Admin' && (
              <Tab 
                label={
                  <Badge badgeContent={pendingAdmins.length} color="error" sx={{ '& .MuiBadge-badge': { right: -15 } }}>
                    Solicitudes de Admin
                  </Badge>
                } 
                icon={<MailOutlined />} 
                iconPosition="start"
              />
            )}
          </Tabs>
        </Box>
      </motion.div>

      {tabValue === 0 && (
        <>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Buscar usuarios"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ backgroundColor: 'background.paper' }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UserAddOutlined />}
                onClick={() => setOpenAddDialog(true)}
                sx={{ height: '100%' }}
              >
                Agregar Usuario
              </Button>
            </Grid>
          </Grid>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <TeamOutlined style={{ fontSize: '3rem' }} />
              </motion.div>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredUsers.map((user, index) => (
                  <Grid item xs={12} sm={6} md={4} key={user.userID}>
                    <motion.div
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      variants={cardVariants}
                      layoutId={`user-${user.userID}`}
                    >
                      <MainCard
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedUser(user)}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            height: '40px', 
                            backgroundColor: user.role === 'Admin' ? 'error.light' : user.role === 'Manager' ? 'warning.light' : 'primary.light',
                            zIndex: 0
                          }} 
                        />
                        
                        <Box sx={{ position: 'relative', zIndex: 1, pt: 2 }}>
                          <Stack 
                            direction="column" 
                            spacing={2} 
                            alignItems="center" 
                            sx={{ mb: 2 }}
                          >
                            <Avatar
                              sx={{
                                width: 80,
                                height: 80,
                                backgroundColor: user.role === 'Admin' ? 'error.main' : user.role === 'Manager' ? 'warning.main' : 'primary.main',
                                mb: 1,
                                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                              }}
                            >
                              {user.firstname[0]}{user.lastname[0]}
                            </Avatar>
                            
                            <Typography variant="h4" sx={{ textAlign: 'center' }}>
                              {user.firstname} {user.lastname}
                            </Typography>
                            
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                              {user.email}
                            </Typography>
                          </Stack>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1">Rol:</Typography>
                            {getRoleChip(user.role, user.status)}
                          </Stack>
                        </Box>
                      </MainCard>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          <Typography variant="h4" gutterBottom>
            Solicitudes pendientes de aprobación
          </Typography>
          
          {pendingAdmins.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <MailOutlined style={{ fontSize: '4rem', opacity: 0.5 }} />
              </motion.div>
              <Typography variant="h5" sx={{ mt: 2, opacity: 0.7 }}>
                No hay solicitudes pendientes
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {pendingAdmins.map((admin, index) => (
                  <Grid item xs={12} md={6} key={admin.userID}>
                    <motion.div
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                    >
                      <MainCard>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Avatar
                            sx={{
                              width: 60,
                              height: 60,
                              backgroundColor: 'warning.main'
                            }}
                          >
                            {admin.firstname[0]}{admin.lastname[0]}
                          </Avatar>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h4">
                              {admin.firstname} {admin.lastname}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {admin.email}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {getRoleChip(admin.role, admin.status)}
                            </Box>
                          </Box>
                          
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Aprobar">
                              <IconButton 
                                color="success" 
                                onClick={() => handleApproveAdmin(admin.userID, true)}
                                sx={{ border: '1px solid', borderColor: 'success.main' }}
                              >
                                <CheckOutlined />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Rechazar">
                              <IconButton 
                                color="error" 
                                onClick={() => handleApproveAdmin(admin.userID, false)}
                                sx={{ border: '1px solid', borderColor: 'error.main' }}
                              >
                                <CloseOutlined />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      </MainCard>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </>
      )}
      
      {/* Modal for user role edit */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'black',
                zIndex: 1000
              }}
              onClick={() => setSelectedUser(null)}
            />
            
            <motion.div
              layoutId={`user-${selectedUser.userID}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1001,
                width: '400px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <MainCard>
                <Stack spacing={3}>
                  <Typography variant="h3">Editar usuario</Typography>
                  
                  <Stack direction="column" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: selectedUser.role === 'Admin' ? 'error.main' : selectedUser.role === 'Manager' ? 'warning.main' : 'primary.main',
                        mb: 1,
                        fontSize: '2rem'
                      }}
                    >
                      {selectedUser.firstname[0]}{selectedUser.lastname[0]}
                    </Avatar>
                    
                    <Typography variant="h4">
                      {selectedUser.firstname} {selectedUser.lastname}
                    </Typography>
                    
                    <Typography variant="body1" color="textSecondary">
                      {selectedUser.email}
                    </Typography>
                  </Stack>
                  
                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">Rol</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={selectedUser.role}
                      label="Rol"
                      onChange={(e) => {
                        if (user && user.role === 'Admin') {
                          handleRoleChange(selectedUser.userID, e.target.value);
                          setSelectedUser({...selectedUser, role: e.target.value});
                        } else {
                          setSnackbar({
                            open: true,
                            message: 'Solo los administradores pueden cambiar roles',
                            severity: 'error'
                          });
                        }
                      }}
                    >
                      <MenuItem value="Admin">Administrador</MenuItem>
                      <MenuItem value="Manager">Gerente</MenuItem>
                      <MenuItem value="User">Usuario</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="error"
                      startIcon={<DeleteOutlined />}
                      onClick={() => {
                        if (window.confirm(`¿Está seguro que desea eliminar a ${selectedUser.firstname} ${selectedUser.lastname}?`)) {
                          handleDeleteUser(selectedUser.userID);
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                    <Button variant="outlined" onClick={() => setSelectedUser(null)}>
                      Cerrar
                    </Button>
                  </Box>
                </Stack>
              </MainCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dialog for adding new user */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '500px',
            maxWidth: '90vw'
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <UserAddOutlined />
            <Typography variant="h3">Agregar Nuevo Usuario</Typography>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                variant="outlined"
                value={newUser.firstname}
                onChange={(e) => setNewUser({...newUser, firstname: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellido"
                variant="outlined"
                value={newUser.lastname}
                onChange={(e) => setNewUser({...newUser, lastname: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                variant="outlined"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="new-user-role-label">Rol</InputLabel>
                <Select
                  labelId="new-user-role-label"
                  value={newUser.role}
                  label="Rol"
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <MenuItem value="User">Usuario</MenuItem>
                  <MenuItem value="Manager">Gerente</MenuItem>
                  {user && user.role === 'Admin' && (
                    <MenuItem value="Admin">Administrador</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenAddDialog(false)} variant="outlined">
            Cancelar
          </Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained"
            startIcon={<PlusOutlined />}
          >
            Agregar Usuario
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ maxWidth: '80%' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserRoles;
