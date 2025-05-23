import PropTypes from 'prop-types';

// material-ui
import { Box, Grid, Typography } from '@mui/material';

// project import
// import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AuthCard from './AuthCard';

// assets
import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      backgroundImage: `url("https://www.torrestech.cl/assets/css/images/overlay.png"), url("https://www.torrestech.cl/images/banner.jpg")`
    }}
  >
    <AuthBackground />
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        lg: { minHeight: '100vh' }
      }}
    >
      <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
        <Grid container flexDirection="row" columnGap={2} alignItems="center">
          <Logo isIcon sx={{ width: 35, height: 35 }} />
          <Typography variant="h3">T-TECH LTDA</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
        >
          <Grid item>
            <AuthCard>{children}</AuthCard>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <AuthFooter />
      </Grid> */}
    </Grid>
  </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node
};

export default AuthWrapper;
