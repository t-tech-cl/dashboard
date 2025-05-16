// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthResetCodeVerification from 'sections/auth/auth-forms/AuthResetCodeVerification';

// ================================|| RESET PASSWORD VERIFICATION ||================================ //

const VerifyResetCode = () => {
  const location = useLocation();
  const email = location.state?.email || '';

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography variant="h3">Verificación de Código</Typography>
            <Typography color="secondary">Ingresa el código de 6 dígitos enviado a tu correo.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Hemos enviado un código de verificación a{' '}
            {email
              ? email.replace(/(.{2})(.*)(?=@)/g, function (gp1, gp2, gp3) {
                  return gp2 + '*'.repeat(gp3.length);
                })
              : 'tu correo'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <AuthResetCodeVerification />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default VerifyResetCode;
