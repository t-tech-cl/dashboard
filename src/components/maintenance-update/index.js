import { Grid } from '@mui/material';
import MaintenanceUpdateForm from 'components/forms/maintenance-update';
import AuthCard from 'sections/auth/AuthCard';

const MaintenanceUpdateComponent = () => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <AuthCard>
        <MaintenanceUpdateForm />
      </AuthCard>
    </Grid>
  );
};

export default MaintenanceUpdateComponent;
