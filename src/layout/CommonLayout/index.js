import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
// import { Container, Toolbar } from '@mui/material';

// project import
// import ComponentLayout from './ComponentLayout';
// import { dispatch, useSelector } from 'store';
// import { openComponentDrawer } from 'store/reducers/menu';

// material-ui
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// const Header = lazy(() => import('./Header'));
// const FooterBlock = lazy(() => import('./FooterBlock'));

// ==============================|| Loader ||============================== //

const LoaderWrapper = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2001,
  width: '100%',
  '& > * + *': {
    marginTop: theme.spacing(2)
  }
}));

const Loader = () => (
  <LoaderWrapper>
    <LinearProgress color="primary" />
  </LoaderWrapper>
);

// ==============================|| MINIMAL LAYOUT ||============================== //

const CommonLayout = ({ layout = 'blank' }) => {
  return (
    <>
      {(layout === 'landing' || layout === 'simple') && (
        <Suspense fallback={<Loader />}>
          {/* <Header layout={layout} /> */}
          <Outlet />
          {/* <FooterBlock isFull={layout === 'landing'} /> */}
        </Suspense>
      )}
      {layout === 'blank' && <Outlet />}
    </>
  );
};

CommonLayout.propTypes = {
  layout: PropTypes.string
};

export default CommonLayout;
