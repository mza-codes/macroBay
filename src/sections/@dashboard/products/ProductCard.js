import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Button, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/Label';
import { ColorPreview } from '../../../components/color-utils';
import ProductView from '../../../pages/ProductView';
import { SingleProduct } from 'src/Contexts/ProductContext';
import { useContext } from 'react';
import { User } from 'src/Contexts/UserContext';
import Iconify from 'src/components/Iconify';
import { deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from 'src/Contexts/firebaseConfig';
import { deleteObject, getMetadata, ref } from 'firebase/storage';
import { ProductsRefresh } from 'src/pages/Products';
import { useState } from 'react';

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
  const { setSingleItem } = useContext(SingleProduct)
  const { user } = useContext(User)
  const { setReload,setAlert } = useContext(ProductsRefresh)
  let admin = false
  if (user) {
    if (user.email.includes("macrobay")) {
      admin = true
    } else {
      admin = false
    }
  }
  const { name, category, postDate, price, url, id } = product
  const route = useNavigate()
  // let status =  //'-10%'  
  let priceSale = price * 2 - 14
  let status = '-' + 20 + '%'
  function renderProduct() {
    setSingleItem(product)
    route('/dashboard/viewproduct')
  }

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
      sessionStorage.removeItem("localProducts")
      setReload(true)
      
    } catch (err) {
      console.log('ERROR OCCURED', err);
    }

    if (metadata) {
      console.log('logging MetaData TRUE ::', metadata.fullPath);
      if (metadata.fullPath) {
        const file = ref(storage, metadata.fullPath)
        deleteObject(file)
      }
    }
    // console.log('logging value E', proId, imageName);
    // imageName.slice('*.jpeg')
    // console.log(imageName);
    // const imageRef = ref(storage, imageName)
    // getMetadata(imageRef).then((metadata) => {
    //   console.log('logging MetaData ::', metadata);
    //   const file = ref(storage, metadata.fullPath)
    //   deleteObject(file).then(() => {
    //     const docRef = doc(db, 'products', proId)
    //     deleteDoc(docRef).then(() => {
    //       alert('complete')
    //     }).catch((err) => { console.log(err); })
    //   }).catch((err) => { console.log(err); })
    // }).catch((err) => {
    //   console.log('ERROR', err);
    // })
    // alert('complete')
  }
  return (
    <Card className='pointer' >
      <Box sx={{ pt: '100%', position: 'relative' }} onClick={renderProduct}>
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
