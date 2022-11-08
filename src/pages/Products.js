import { useState } from 'react';
// material
import { Alert, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import { createContext } from 'react';
import Iconify from 'src/components/Iconify';
import useResponsive from 'src/hooks/useResponsive';

export const ProductsRefresh = createContext(null)

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const [reload, setReload] = useState(false);
  const [alert, setAlert] = useState(false);
  const isMobile = useResponsive('down', 'sm');

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Page title="Sale">
      <Container>
        <Typography variant="h4" sx={{ mb: 2 }}>
          {'Products'}
        </Typography>
        {alert && <Alert variant='filled' severity='info' > Item Deleted Successfully! </Alert>}
        <ProductsRefresh.Provider value={{ reload, setReload, alert, setAlert }}>
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <Tooltip title='Reload Data from Server'>
                <IconButton color='primary' onClick={() => { sessionStorage.removeItem("localProducts"); setReload(true) }} >
                  <Iconify icon="fontisto:cloud-refresh" width={25} height={25} />
                </IconButton></Tooltip>
              <ProductFilterSidebar
                isOpenFilter={openFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
              />
              <ProductSort />
            </Stack>
          </Stack>

          <ProductList />

          {isMobile && <ProductCartWidget />}
        </ProductsRefresh.Provider>
      </Container>
    </Page>
  );
};
