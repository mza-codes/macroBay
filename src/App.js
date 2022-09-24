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
import { auth } from './Contexts/firebaseConfig';
import { useContext } from 'react';
import { User } from './Contexts/UserContext';

// ----------------------------------------------------------------------

export default function App() {
  const {user,setUser} = useContext(User)
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      setUser(user)
    })
  },[])
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
