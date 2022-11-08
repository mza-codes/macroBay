import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { ProductsRefresh } from 'src/pages/Products';
import _ from 'lodash';
import { useProductContext } from 'src/Contexts/ProductContext';

export default function ProductList({ ...other }) {
  const [products, setProducts] = useState([])
  const { reload, setReload } = useContext(ProductsRefresh);
  const { saleItems } = useProductContext();

  useEffect(() => {
    saleItems && setProducts(saleItems);
  }, [saleItems, reload]);

  return (
    <>
      <Grid container spacing={3} {...other}>
        {products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={3}>
            <ShopProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};
