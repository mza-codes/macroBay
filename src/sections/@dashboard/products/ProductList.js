import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from 'src/Contexts/firebaseConfig';

// ----------------------------------------------------------------------// products,

// ProductList.propTypes = {
//   products: PropTypes.array.isRequired
// };

export default function ProductList({ ...other }) {
  // console.log(products);
  // useEffect(()=>{
  const [products, setProducts] = useState([])
  async function fetchData() {
    const items = await getDocs(collection(db, 'products'))
    console.log('logging items FROM FIRESTORE');
    // items.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());
    // });
    const allProducts = items.docs.map((product) => {
      return {
        ...product.data(),
        id: product.id
      }
    })
    console.log(allProducts);
    setProducts(allProducts)
  }
  useEffect(() => {
    fetchData()
  }, [])

  // })
  return (
    <Grid container spacing={3} {...other}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={3}>
          <ShopProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
