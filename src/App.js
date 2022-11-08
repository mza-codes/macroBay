// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
import './App.css'
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './Contexts/firebaseConfig';
import { useContext } from 'react';
import { User } from './Contexts/UserContext';
import { useProductContext } from './Contexts/ProductContext';
import { collection, getDocs } from 'firebase/firestore';
import _ from 'lodash';

// ----------------------------------------------------------------------

export default function App() {
  const { user, setUser } = useContext(User);
  const { setSaleItems } = useProductContext();

  const fetchProducts = async () => {
    console.log("FETCHING FROM FIRESTORE");
    try {
      const data = await getDocs(collection(db, 'products'))
      const localItems = data.docs.map((product) => {
        return {
          ...product.data(),
          id: product.id
        }
      });
      console.log('DATA Fetched from Server,logging ARRAY::: ', localItems);
      let sorted = _.sortBy(localItems, 'postDate').reverse();
      setSaleItems(sorted);
      return true;

    } catch (e) {
      console.log("Error Fetching Products from Firestore", e);
      return false;
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      fetchProducts();
      setUser(user);
      console.log(user);
    })
  }, []);
  
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
