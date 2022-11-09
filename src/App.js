import Router from './routes';
import ThemeProvider from './theme';
import './App.css'
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './Contexts/firebaseConfig';
import { useAuthContext } from './Contexts/UserContext';
import { useProductContext } from './Contexts/ProductContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import _ from 'lodash';

// ----------------------------------------------------------------------

export default function App() {
  const { setSaleItems } = useProductContext();
  const { setUserData, setUser } = useAuthContext();

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

  // fetchUserDoc for profile Updation
  const fetchUserData = async (currentUser) => {
    let docData, docID;
    const q = query(collection(db, 'webusers'), where('id', '==', currentUser.uid));
    await getDocs(q).then((result) => {
      console.log(result)
      if (result.docs.length === 0) {
        console.log('if true entered docs length ===0 ');
        setUserData({
          docId: "",
        });
        return false;
      }
      result.forEach((doc) => {
        docID = doc.id
        docData = doc.data()
      });
      setUserData({
        docId: docID,
        ...docData
      });
    }).catch((err) => { console.log(err); })
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      fetchProducts();
      setUser(user);
      user && fetchUserData(user);
      console.log(user);
    });

    return () => { unsub(); };
  }, []);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
