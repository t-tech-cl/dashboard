import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Typography, FormHelperText } from '@mui/material';

// third-party
import OtpInput from 'react18-input-otp';

// project import
import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';
import { ThemeMode } from 'config';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

// ============================|| PASSWORD RESET - CODE VERIFICATION ||============================ //

const AuthResetCodeVerification = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { requestPasswordReset, verifyResetCode } = useAuth();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300];

  useEffect(() => {
    // If no email was provided, redirect back to forgot password
    if (!email) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Se requiere un correo electrónico para verificar el código',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  const handleOtpChange = (value) => {
    setOtp(value);
    setIsOtpComplete(value.length === 6);
  };

  const handleVerifyCode = async () => {
    if (!isOtpComplete) {
      setError('Por favor, ingrese el código de 6 dígitos completo');
      return;
    }

    try {
      setVerifying(true);
      // Use context function to verify the code
      await verifyResetCode(email, otp);

      // If code is verified, navigate to password reset page
      navigate('/new-password', {
        state: {
          email,
          resetCode: otp,
          verified: true
        },
        replace: true
      });
    } catch (err) {
      setError(err.message || 'Error al verificar el código');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await requestPasswordReset(email);
      setError('');
    } catch (err) {
      setError(err.message || 'Error al reenviar el código');
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <OtpInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={6}
          containerStyle={{ justifyContent: 'space-between' }}
          inputStyle={{
            width: '3rem',
            height: '3rem',
            margin: '8px',
            padding: '10px',
            fontSize: '1.5rem',
            borderRadius: 4,
            border: `1px solid ${borderColor}`
          }}
          focusStyle={{
            outline: 'none',
            boxShadow: theme.customShadows.primary,
            border: `1px solid ${theme.palette.primary.main}`
          }}
          isInputNum
          shouldAutoFocus
        />
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
            onClick={handleVerifyCode}
            variant="contained"
            disabled={!isOtpComplete || verifying}
          >
            {verifying ? 'Verificando...' : 'Verificar Código'}
          </Button>
        </AnimateButton>
      </Grid>

      <Grid item xs={12}>
        <span>
          <Typography>¿No recibiste el código? Revisa tu carpeta de spam, o</Typography>
          <Typography variant="body1" sx={{ textDecoration: 'none', cursor: 'pointer' }} color="primary" onClick={handleResendCode}>
            Reenviar código
          </Typography>
        </span>
      </Grid>
    </Grid>
  );
};

export default AuthResetCodeVerification;
