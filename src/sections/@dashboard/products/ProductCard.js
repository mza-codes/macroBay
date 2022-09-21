import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/Label';
import { ColorPreview } from '../../../components/color-utils';
import ProductView from '../../../pages/ProductView';
import { SingleProduct } from 'src/Contexts/ProductContext';
import { useContext } from 'react';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  // console.log(product);
  // const { name, cover, price, colors, status, priceSale } = product;
  const {setSingleItem} = useContext(SingleProduct)
  const {name, category, postDate, price, url} = product
  const route = useNavigate()
  // let status =  //'-10%'  
  let priceSale = price*2-14
  let status = '-'+20+'%'
  function renderProduct(){
    setSingleItem(product)
    route('/dashboard/viewproduct')
  }
  return (
    <Card className='pointer' onClick={renderProduct}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'info') || 'error'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <ProductImgStyle alt={name} src={url} />
      </Box>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Link to="/viewproduct" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
        <Typography variant="subtitle2" noWrap>
            {category}
          </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* <ColorPreview colors={colors} /> */}
          <Typography variant="subtitle1">
            {/* <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {price && fCurrency(priceSale)}
            </Typography> */}
            &nbsp;
            {/* {fCurrency(price)} */}
            ₹ {price}
          </Typography>
          <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {/* {price && fCurrency(priceSale)} */}
              {price && `₹ ${priceSale}`}
            </Typography>
        </Stack>
        <span style={{fontSize:'0.7rem',paddingTop:'0.5rem'}}>{postDate.slice(0,10)}</span>
        {/* <span style={{fontSize:'0.7rem',paddingTop:'0.5rem'}}>{postDate}</span> */}
      </Stack>
    </Card>
  );
}
