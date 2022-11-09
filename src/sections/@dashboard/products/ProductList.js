import { Grid, Typography } from '@mui/material';
import ShopProductCard from './ProductCard';
import { useProductContext } from 'src/Contexts/ProductContext';

export default function ProductList({ ...other }) {
  const { saleItems } = useProductContext();

  return (
    <>
      {saleItems?.length === 0 && <Typography variant='h5' textAlign="center" m={2}>Loading Data..</Typography>}
      <Grid container spacing={3} {...other}>
        {saleItems.map((product) => (
          <Grid key={product.postDate} item xs={12} sm={6} md={3}>
            <ShopProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  )
};
