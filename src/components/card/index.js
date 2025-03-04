import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { motion } from 'framer-motion';

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

const Card = ({ children, maxWidth = { xs: 400, lg: 475 }, margin = { xs: 2.5, md: 3 }, padding = { xs: 1 }, ...other }) => {
  const theme = useTheme();
  return (
    <MainCard
      sx={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        maxWidth,
        margin,
        padding,
        '& > *': {
          flexGrow: 1,
          flexBasis: '50%'
        }
      }}
      content={false}
      {...other}
      border={false}
      boxShadow
      shadow={theme.customShadows.z1}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}
      >
        {children}
      </Box>
    </MainCard>
  );
};

Card.propTypes = {
  children: PropTypes.node
};

export default Card;
