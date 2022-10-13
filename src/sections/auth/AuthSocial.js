// material
import { Stack, Button, Divider, Typography } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { app, auth, db } from 'src/Contexts/firebaseConfig';
import { User } from 'src/Contexts/UserContext';
// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const { user, setUser } = useContext(User)
  const [errMsg, setErrorMsg] = useState('')
  const route = useNavigate()

  const storeUser = async (userData) => {
    console.log('storing user');
    let joinDate = new Date().toLocaleString()
    let v = Math.floor((Math.random() * 24) + 1)
    let avatar = `/static/mock-images/avatars/avatar_${v}.jpg`
    await updateProfile(userData, { photoURL: avatar }).then(() => {
      addDoc(collection(db, 'webusers'), {
        id: userData.uid,
        username: userData.displayName,
        email: userData.email,
        phone: '',
        avatar,
        altMobile: '',
        location: '',
        pincode: '',
        joinDate,
      }).then((response) => {
        console.log('CHECK DOC ID', response);
        route('/');

      }).catch((err) => { console.log(err); setErrorMsg(err.message) })
    }).catch((err) => { console.log(err); setErrorMsg(err.message) })
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider).then((result) => {

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const newUser = result.user;
      setUser(newUser)
      const q = query(collection(db, 'webusers'), where('id', '==', newUser.uid))
      getDocs(q).then((result) => {
        if (result.docs.length === 0) {
          console.log('No User Document found');
          storeUser(newUser)
        } else {
          console.log('COMPLETE');
          route('/')
        }
      })
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  return (
    <>
      <Stack direction="row" spacing={2}>

        <Button fullWidth size="large" disabled color="inherit" variant="outlined">
          <Iconify icon="eva:facebook-fill" color="grey" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={signInWithGoogle} >
          <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
        </Button>

        <Button fullWidth size="large" disabled color="inherit" variant="outlined">
          <Iconify icon="eva:twitter-fill" color="grey" width={22} height={22} />
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
