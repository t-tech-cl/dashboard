import { Link } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

import AnimateButton from 'components/@extended/AnimateButton';
import useAuth from 'hooks/useAuth';

// assets
import { StopOutlined, HomeOutlined } from '@ant-design/icons';

// styles
const GridStyled = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: '100%'
  }
}));

const CardMediaStyled = styled(CardMedia)({
  width: '100%',
  height: '100%',
  objectFit: 'scale-down'
});

const ForbiddenStyled = styled('div')({
  width: '100%',
  maxWidth: 500,
  height: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'error.main',
  fontSize: '10rem'
});

// ==============================|| ERROR 403 - FORBIDDEN ||============================== //

const Forbidden = () => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Grid 
      container 
      justifyContent="center" 
      alignItems="center" 
      sx={{ 
        minHeight: '100vh', 
        backgroundImage: `url("https://www.torrestech.cl/assets/css/images/overlay.png"), url("https://www.torrestech.cl/images/banner.jpg")`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        px: 2 
      }}
    >
      <Grid item xs={12} sm={12} md={10} lg={8}>
        <Card sx={{ 
          width: '100%', 
          boxShadow: theme.shadows[7],
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Grid container justifyContent="center" alignItems="center">
            <GridStyled item xs={12} sm={6}>
              <CardContent sx={{ padding: 5, textAlign: 'center' }}>
                <StopOutlined style={{ fontSize: '5rem', color: theme.palette.error.main, marginBottom: '1rem' }} />
                <Typography variant="h1" color="error">Acceso Denegado</Typography>
                <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
                  Lo sentimos, no tienes permisos para acceder a esta área.
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 4 }}>
                  Tu rol actual ({user?.role}) no tiene acceso a esta funcionalidad.
                </Typography>
                <AnimateButton>
                  <Button component={Link} to="/" variant="contained" startIcon={<HomeOutlined />}>
                    Volver al inicio
                  </Button>
                </AnimateButton>
              </CardContent>
            </GridStyled>
            <GridStyled item xs={12} sm={6}>
              <CardMediaStyled>
                <ForbiddenStyled>
                  <StopOutlined />
                </ForbiddenStyled>
              </CardMediaStyled>
            </GridStyled>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Forbidden; 