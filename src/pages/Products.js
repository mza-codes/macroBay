import { useState } from 'react';
// material
import { Alert, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import { createContext } from 'react';

// ----------------------------------------------------------------------
export const ProductsRefresh = createContext(null)
export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const [reload, setReload] = useState(false)
  const [alert,setAlert] = useState(false)
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
          Products
        </Typography>
        {alert && <Alert variant='filled' severity='info' > Item Deleted Successfully! </Alert>}
        <ProductsRefresh.Provider value={{ reload, setReload, alert, setAlert }}>
          <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <ProductFilterSidebar
                isOpenFilter={openFilter}
                onOpenFilter={handleOpenFilter}
                onCloseFilter={handleCloseFilter}
              />
              <ProductSort />
            </Stack>
          </Stack>

          <ProductList />

          <ProductCartWidget />
        </ProductsRefresh.Provider>
      </Container>
    </Page>
  );
}
