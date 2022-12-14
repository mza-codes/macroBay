import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography, Alert } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import useResponsive from 'src/hooks/useResponsive';
import SearchbarPopOver from './SearchbarPopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const isDesktop = useResponsive('up', 'lg');
  const isMobile = useResponsive('down','sm')
  const isMd = useResponsive('down','md')
  // console.log('isDesktop',isDesktop,'isMobile',isMobile)
  // console.log('isMd lo::',isMd); , display: { lg: 'none' }
  return (
    <RootStyle>
      <ToolbarStyle>
        {!isDesktop && <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>}

        {!isMobile && !isMd && <Searchbar /> }
        {/* {} */}

        {/* <div>
          <Box alignContent='center' alignItems='center' textAlign='center' sx={{ color: 'darkgreen', mx: 'auto', display: 'flex', fontSize: 14 }}>
            <h6 className="m-auto successInput">hi this field will be succes diplay</h6>
          </Box>
        </div> */}
        {/* {!isDesktop && (
          <div >
            <Alert sx={{ml:1}} variant="filled" severity="success" color="success">
              Action Success
            </Alert>
          </div>
        )}
        {isDesktop && (
          <Alert sx={{ml:2}} variant="filled" severity="success" color="success">
            Item Listed for Sale <strong>Successfully</strong>
          </Alert>
        )} */}


        <Box sx={{ flexGrow: 1 }} />


        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <SearchbarPopOver />
          {/* <LanguagePopover /> */}
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
