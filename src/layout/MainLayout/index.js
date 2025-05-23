import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Container, Toolbar } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import HorizontalBar from './Drawer/HorizontalBar';

import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import { dispatch } from 'store';
import { openDrawer } from 'store/reducers/menu';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownXL = useMediaQuery(theme.breakpoints.down('xl'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { container, miniDrawer, menuOrientation } = useConfig();
  
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      dispatch(openDrawer(!matchDownXL));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownXL]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        backgroundImage: `url("https://www.torrestech.cl/assets/css/images/overlay.png"), url("https://www.torrestech.cl/images/banner.jpg")`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}
    >
      <Header />
      {!isHorizontal ? <Drawer /> : <HorizontalBar />}
      <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1 }}>
        <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
        {/* <ScrollIndicator /> */}
        <Container
          maxWidth={container ? 'xl' : false}
          sx={{
            ...(container && { px: { xs: 2, sm: 5 } }),
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column',
            scrollSnapType: 'y mandatory',
            height: '100vh',
            overflowY: 'scroll'
          }}
        >
          {/* <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} /> */}

          <Outlet />
          {/* <Footer /> */}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
