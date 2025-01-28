import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, useMediaQuery } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/logo';
import useConfig from 'hooks/useConfig';
import { MenuOrientation } from 'config';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? 'unset' : '60px',
        width: isHorizontal ? { xs: '100%', lg: '424px' } : 'inherit',
        paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          rowGap: '10px',
          columnGap: '10px',
          alignItems: 'center'
        }}
      >
        <Logo isIcon sx={{ width: 35, height: 35 }} />
        {open && <Typography variant="h3">T-TECH LTDA</Typography>}
      </div>
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default DrawerHeader;
