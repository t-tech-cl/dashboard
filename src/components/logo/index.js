import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project import
import LogoIcon from '../../assets/images/logo.png';
import LogoMain from '../../assets/images/logo-main.png';
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ isIcon, sx, to }) => (
  <ButtonBase disableRipple component={Link} to={!to ? APP_DEFAULT_PATH : to} sx={sx}>
    {isIcon ? (
      <img src={LogoIcon} alt="logo" style={{ height: 34, width: 34 }} />
    ) : (
      <img src={LogoMain} alt="logo" style={{ height: 34, width: 34 }} />
    )}
  </ButtonBase>
);

LogoSection.propTypes = {
  reverse: PropTypes.bool,
  isIcon: PropTypes.bool,
  sx: PropTypes.object,
  to: PropTypes.string
};

export default LogoSection;
