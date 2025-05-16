import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
import {
  Button,
  Grid,
  Stack,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  FormControl,
  Box,
  Typography
} from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

// ============================|| PASSWORD RESET - NEW PASSWORD ||============================ //

const AuthNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyResetCodeAndUpdatePassword } = useAuth();

  // State should come from the OTP verification page
  const { email, resetCode, verified } = location.state || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Password strength state
  const [level, setLevel] = useState();

  // Password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle handlers for password visibility
  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Calculate and update password strength
  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  // Initialize password strength on component mount
  useEffect(() => {
    changePassword('');
  }, []);

  // Check if passwords match whenever either password changes
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true); // Don't show error when confirmPassword is empty
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    // If not coming from OTP verification, redirect to forgot password
    if (!email || !resetCode || !verified) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Debes verificar el código primero',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      navigate('/forgot-password', { replace: true });
    }
  }, [email, resetCode, verified, navigate]);

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      setError('Por favor, ingrese su nueva contraseña');
      return;
    }

    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setUpdating(true);
      // Use the context function to update the password
      await verifyResetCodeAndUpdatePassword(email, resetCode, newPassword);

      // Redirect to login page
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setUpdating(false);
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    changePassword(value);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <InputLabel htmlFor="new-password">Nueva Contraseña</InputLabel>
          <OutlinedInput
            fullWidth
            id="new-password"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="Ingresa tu nueva contraseña"
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleToggleNewPassword} edge="end" size="large">
                  {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* Password strength indicator */}
          <FormControl fullWidth sx={{ mt: 1.5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" fontSize="0.75rem">
                  {level?.label}
                </Typography>
              </Grid>
            </Grid>
          </FormControl>
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Stack spacing={1}>
          <InputLabel htmlFor="confirm-password">Confirmar Contraseña</InputLabel>
          <OutlinedInput
            fullWidth
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirma tu nueva contraseña"
            error={!passwordsMatch}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleToggleConfirmPassword} edge="end" size="large">
                  {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </IconButton>
              </InputAdornment>
            }
          />
          {!passwordsMatch && <FormHelperText error>Las contraseñas no coinciden</FormHelperText>}
        </Stack>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <FormHelperText error>{error}</FormHelperText>
        </Grid>
      )}

      <Grid item xs={12}>
        <AnimateButton>
          <Button
            disableElevation
            fullWidth
            size="large"
            onClick={handleUpdatePassword}
            variant="contained"
            disabled={!newPassword || !confirmPassword || updating || !passwordsMatch}
          >
            {updating ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </AnimateButton>
      </Grid>
    </Grid>
  );
};

export default AuthNewPassword;
