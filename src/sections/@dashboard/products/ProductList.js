
// material
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from 'src/Contexts/firebaseConfig';
import { useContext } from 'react';
import { ProductsRefresh } from 'src/pages/Products';
import _ from 'lodash';

// ----------------------------------------------------------------------// products,

// ProductList.propTypes = {
//   products: PropTypes.array.isRequired
// };

export default function ProductList({ ...other }) {
  const [products, setProducts] = useState([])
  const {reload,setReload}= useContext(ProductsRefresh)
  async function fetchData() {
    var storedArray = sessionStorage.getItem("localProducts");
    if (storedArray == null) {
      console.log('STORED ARRAY FOUND NULL FETCHING DATA FROM SERVER');
      const data = await getDocs(collection(db, 'products'))
      const localItems = data.docs.map((product) => {
        return {
          ...product.data(),
          id: product.id
        }
      })
      let sorted = _.sortBy(localItems, 'postDate').reverse()
      sessionStorage.setItem("localProducts", JSON.stringify(sorted));
      const localData = sessionStorage.getItem("localProducts");
      let localProducts = JSON.parse(localData);
      console.log('DATA Fetched from Server,logging STORED ARRAY::: ', localProducts);
      setProducts(localProducts)
    } else {
      let localProducts = JSON.parse(storedArray);
      setProducts(localProducts)
    }
    setReload(false)
    // sessionStorage.setItem("items", JSON.stringify(allProducts));
    // setProducts(items)
    // setProducts(localItems)
    // console.log('logging localItems', localItems);
    // }
  }
  useEffect(() => {
    // var prod = sessionStorage.getItem('products')
    // console.log('logging prod');
    // console.log(prod);
    fetchData()
  }, [reload])

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
