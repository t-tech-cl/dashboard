import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from './useAuth';

const useUserRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if the user is logged in, has type 'user', and is on the root path or dashboard
    if (user && user.type === 'user' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      navigate('/mantenimiento/buscar-documento', { replace: true });
    }
  }, [user, navigate, location.pathname]);
};

export default useUserRedirect; 