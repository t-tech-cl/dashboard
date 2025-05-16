import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import SHA256 from 'crypto-js/sha256';

// third-party
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch as storeDispatch } from 'store';

// project import
import Loader from 'components/Loader';
import axios from 'utils/axios';
import { ACCOUNT_ENDPOINTS } from 'const/urls';

// assets
import { CheckOutlined } from '@ant-design/icons';

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const user = jwtDecode(serviceToken);
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    try {
      const encryptedPass = SHA256(password).toString();
      const response = await axios.post(ACCOUNT_ENDPOINTS.LOGIN, { email, password: encryptedPass });
      const { token, user } = response.data;
      setSession(token);
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });

      // Show success login message
      storeDispatch(
        openSnackbar({
          open: true,
          message: `¡Bienvenido, ${user.firstname}!`,
          variant: 'alert',
          alert: {
            color: 'success',
            icon: <CheckOutlined style={{ marginRight: '8px' }} />
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          transition: 'SlideDown'
        })
      );
    } catch (error) {
      // Check if there's a response with an error type
      console.log('error', error);
      if (error.type) {
        // Remove the alert that was preventing the snackbar from showing properly
        const { type, error: errorMessage } = error;
        // Show specific snackbar message based on error type
        if (type === 'account_not_found') {
          storeDispatch(
            openSnackbar({
              open: true,
              message: errorMessage || 'La cuenta no existe. Por favor regístrese primero.',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
              },
              transition: 'SlideDown'
            })
          );
        } else if (type === 'invalid_password') {
          storeDispatch(
            openSnackbar({
              open: true,
              message: errorMessage || 'Contraseña incorrecta',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
              },
              transition: 'SlideDown'
            })
          );
        } else if (type === 'pending_approval') {
          storeDispatch(
            openSnackbar({
              open: true,
              message: errorMessage || 'Su cuenta de administrador está pendiente de aprobación',
              variant: 'alert',
              alert: {
                color: 'info'
              },
              close: true,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
              },
              transition: 'SlideDown'
            })
          );
        } else {
          // Generic error
          storeDispatch(
            openSnackbar({
              open: true,
              message: errorMessage || 'Error de inicio de sesión',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: true,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
              },
              transition: 'SlideDown'
            })
          );
        }
      }
      // Re-throw the error to be caught by the login form
      throw error;
    }
  };

  const register = async (email, password, firstname, lastname) => {
    try {
      // Hash the password before sending
      const encryptedPass = SHA256(password).toString();

      const response = await axios.post(ACCOUNT_ENDPOINTS.REGISTER, {
        email,
        password: encryptedPass,
        firstname,
        lastname
      });

      // Show success message with the message from the response, if available
      storeDispatch(
        openSnackbar({
          open: true,
          message: response.data.message || 'Registro exitoso. Ahora puede iniciar sesión.',
          variant: 'warning',
          alert: {
            color: 'success',
            icon: <CheckOutlined style={{ marginRight: '8px' }} />
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
          transition: 'SlideDown'
        })
      );

      return response.data;
    } catch (error) {
      // Handle registration errors
      const errorMessage = error.response?.data?.error || 'Error en el registro. Por favor intente nuevamente.';

      storeDispatch(
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        })
      );

      throw error; // Re-throw the error so it can be caught by the form
    }
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const requestPasswordReset = async (email) => {
    try {
      const response = await axios.post('/api/account/request-password-reset', { email });

      storeDispatch(
        openSnackbar({
          open: true,
          message: 'Se ha enviado un código de verificación a tu correo',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        })
      );

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al solicitar el restablecimiento de contraseña';

      storeDispatch(
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        })
      );

      throw error;
    }
  };

  const verifyResetCode = async (email, resetCode) => {
    try {
      const response = await axios.post('/api/account/verify-reset-code', {
        email,
        resetCode
      });

      storeDispatch(
        openSnackbar({
          open: true,
          message: 'Código verificado correctamente',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        })
      );

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al verificar el código';

      storeDispatch(
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        })
      );

      throw error;
    }
  };

  const verifyResetCodeAndUpdatePassword = async (email, resetCode, newPassword) => {
    try {
      // Hash the password before sending
      const encryptedPass = SHA256(newPassword).toString();

      const response = await axios.post('/api/account/reset-password', {
        email,
        resetCode,
        newPassword: encryptedPass
      });

      storeDispatch(
        openSnackbar({
          open: true,
          message: 'Tu contraseña ha sido actualizada exitosamente',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        })
      );

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al verificar el código o actualizar la contraseña';

      storeDispatch(
        openSnackbar({
          open: true,
          message: errorMessage,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: true,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          }
        })
      );

      throw error;
    }
  };

  const resetPassword = async () => {};

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        requestPasswordReset,
        verifyResetCode,
        verifyResetCodeAndUpdatePassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export default AuthContext;
