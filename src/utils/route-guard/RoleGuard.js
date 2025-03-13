import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project import
import useAuth from 'hooks/useAuth';
import { Box, Typography } from '@mui/material';
import { StopOutlined } from '@ant-design/icons';

// ==============================|| ROLE GUARD ||============================== //

const RoleGuard = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      navigate('/forbidden', {
        state: {
          from: location.pathname
        },
        replace: true
      });
    }
  }, [user, allowedRoles, navigate, location]);

  // If user role is allowed, render children
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // If user role checking is in progress, show a loading state
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <StopOutlined style={{ fontSize: '4rem', color: 'error.main', marginBottom: '1rem' }} />
      <Typography variant="h4">Verificando permisos...</Typography>
    </Box>
  );
};

RoleGuard.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RoleGuard; 