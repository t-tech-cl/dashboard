import { useEffect, useState } from 'react';

// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';

import Loader from 'components/Loader';
import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/es';

import { dispatch } from 'store';
import { fetchMenu } from 'store/reducers/menu';

// auth provider
import { AuthProvider } from 'contexts/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch dashboard menu from API
    dispatch(fetchMenu()).then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <ThemeCustomization>
      <RTLLayout>
        <Locales>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
            <ScrollTop>
              <AuthProvider>
                <Notistack>
                  <Routes />
                  <Snackbar />
                </Notistack>
              </AuthProvider>
            </ScrollTop>
          </LocalizationProvider>
        </Locales>
      </RTLLayout>
    </ThemeCustomization>
  );
};

export default App;
