import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

const UserRedirection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if the user is logged in, is of type 'user', and is on the root page or dashboard
    if (user && user.type === 'user' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      navigate('/mantenimiento/buscar-documento', { replace: true });
    }
  }, [user, navigate, location.pathname]);

  return null; // This component doesn't render anything
};

export default UserRedirection; 