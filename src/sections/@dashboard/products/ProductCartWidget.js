// material
import { styled } from '@mui/material/styles';
import { Badge } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { ProductsRefresh } from 'src/pages/Products';
import { useContext } from 'react';

// ----------------------------------------------------------------------
// const pos = 26
const RootStyle = styled('div')(({ theme }) => ({
  zIndex: 999,
  left: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(18),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 }
}));

const RefreshButton = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(26),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 }
}));
// ----------------------------------------------------------------------

export default function CartWidget() {
  const {setReload} = useContext(ProductsRefresh)
  return (
    <div>
      <RootStyle>
        <Badge showZero badgeContent={17} color="error" max={99}>
          <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
        </Badge>
      </RootStyle>
      <RefreshButton onClick={() => { sessionStorage.removeItem("localProducts"); setReload(true) }}>
        <Badge color="warning">
          <Iconify icon="fontisto:cloud-refresh" width={25} height={25} />
        </Badge>
        {/* fontisto:cloud-refresh */}
      </RefreshButton>
    </div>
  );
}
