// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthNewPassword from 'sections/auth/auth-forms/AuthNewPassword';

// ================================|| NEW PASSWORD ||================================ //

const NewPassword = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography variant="h3">Crear Nueva Contraseña</Typography>
            <br />
            <Typography color="secondary">
              Ingresa y confirma tu nueva contraseña. Para la cuenta:{' '}
              {email.replace(/(.{2})(.*)(?=@)/g, function (gp1, gp2, gp3) {
                return gp2 + '*'.repeat(gp3.length);
              })}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthNewPassword />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default NewPassword;
