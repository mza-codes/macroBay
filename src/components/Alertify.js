import PropTypes from 'prop-types';
// icons
import { Icon } from '@iconify/react';
// @mui
import { Alert, Box } from '@mui/material';

// ----------------------------------------------------------------------

Alertify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
};

export default function Alertify({ icon, sx, ...other }) {
  
  return <Box component={Alert} icon={icon} sx={{ ...sx }} {...other} />;
}
