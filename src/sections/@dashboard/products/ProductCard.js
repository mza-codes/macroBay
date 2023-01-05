import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
// import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/Label';
// import { ColorPreview } from '../../../components/color-utils';
import { useContext, useEffect } from 'react';
import { useAuthContext } from 'src/Contexts/UserContext';
import Iconify from 'src/components/Iconify';
import { deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from 'src/Contexts/firebaseConfig';
import { deleteObject, getMetadata, ref } from 'firebase/storage';
import { ProductsRefresh } from 'src/pages/Products';
import lozad from 'lozad';
import { imgLoader } from 'src/assets';

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  // const { name, cover, price, colors, status, priceSale } = product;
  const observer = lozad();
  const { user } = useAuthContext();
  const { setAlert } = useContext(ProductsRefresh)
  let admin = false
  if (user) {
    let domain = user.email.split('@');
    if (domain[1] === "macrobay.org") {
      admin = true
    } else {
      admin = false
    };
  };
  const { name, category, postDate, price, url, id } = product;
  const route = useNavigate();
  let priceSale = price * 2 - 14;
  let status = '-' + 20 + '%';

  const deleteProduct = async (proId, imageName) => {
    const imageRef = ref(storage, imageName)
    console.log('logging imageRef ::', imageRef);
    let metadata = null
    try {
      metadata = await getMetadata(imageRef)
      console.log('logging MetaData ::', metadata);
      const docRef = doc(db, 'products', proId)
      deleteDoc(docRef);
      setAlert(true)
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    } catch (err) {
      console.log('ERROR OCCURED Deleting Doc from Firestore', err);
    };

    if (metadata) {
      console.log('logging MetaData TRUE ::', metadata.fullPath);
      if (metadata.fullPath) {
        const file = ref(storage, metadata.fullPath);
        deleteObject(file);
      };
    };
  };

  useEffect(() => {
    observer.observe();
  });

  return (
    <Card className='pointer' >
      <Box sx={{ pt: '100%', position: 'relative' }} onClick={() => route(`/dashboard/viewproduct/${id}`)}>
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
        <ProductImgStyle alt={name} src={imgLoader} data-src={url} className="lozad" />
      </Box>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Link to={'/dashboard/viewproduct/' + id}
          // to={`/dashboard/viewproduct/${id}`}
          color="inherit" underline="hover" component={RouterLink}>
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
            ₹ {price} /-
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
        <span style={{ fontSize: '0.7rem', paddingTop: '0.5rem' }}>{postDate.slice(0, 10)}</span>
        {/* <span style={{fontSize:'0.7rem',paddingTop:'0.5rem'}}>{postDate}</span> */}
        {admin && <Button onClick={() => {
          if (window.confirm('Delete the item?')) {
            deleteProduct(id, url)
          }
        }} variant='outlined' color='error' >
          <Iconify width={24} height={24} icon='ic:round-delete-forever' /> </Button>}
      </Stack>

    </Card>
  );
}
