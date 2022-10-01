import * as React from 'react';
import { Form, Formik } from 'formik';
import { Box, Container } from '@mui/system';
import { Alert, Grid, IconButton, Stack, Typography } from '@mui/material';
import * as Yup from 'yup'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/Contexts/firebaseConfig';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useContext } from 'react';
import { User } from 'src/Contexts/UserContext';
import CustomInput from 'src/components/hook-form/CustomInput';

export default function RegisterForm() {
  const [complete, setComplete] = useState(false)
  const { user } = useContext(User)
  const variant = 'outlined'

  const registerSchema = Yup.object().shape({
    username: Yup.string().min(5, 'Username too short').max(15, 'Username limit character exceeds').required('UserName is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().min(9, 'Mobile Number not valid').max(15, 'Invalid Mobile Number').required('Mobile Number is required'),
    pincode: Yup.string().min(6, 'Pincode Must be 6 Characters').max(6, 'Pincode Must be 6 Characters')
      .required('PIN Code is required'),
    location: Yup.string().min(3, 'Must be a minimum of 3 Characters').max(20, 'Must not exceed 20 Characters')
      .required('Location Required to Continue'),
    altMobile: Yup.string().min(9, 'Mobile Number not valid').max(15, 'Invalid Mobile Number')
  })

  // useEffect(() => {
  //   console.log('useEff cld hr');
  // }, [])
  const handleUpdate = async (values, actions) => {
    console.log('Updating User Data')
    console.log(values);
    let docId = ''
    const docRef = doc(db, 'webusers', docId)
    const { username, phone, email, location, pincode, altMobile } = values

    await updateDoc(docRef, {
      username,
      phone,
      email,
      location,
      pincode,
      altMobile
    })
      .then((response) => console.log(response))
      .catch((err) => { console.log(err) })
    await updateProfile(user, { displayName: username })
    // setComplete(true)
    // setUpdated(true)
    setTimeout(() => {
      // setOpen(false)
    }, 2500);
  }
  return (
    <div>
      <Grid container item xs={12} direction='column' justifyContent='center' textAlign='center'
        alignContent='center' alignItems='center' gap={2}>
        <Grid item xs={12}>
          <Typography variant='h6'>Enter Your Details </Typography>
        </Grid>

        <Formik initialValues={{
          username: '', email: '', pincode: '', phone: '', location: '', altMobile: '' }}
          validationSchema={registerSchema} onSubmit={handleUpdate} >
          {props => (
            <Form spellCheck >
              {/* {console.log(props)} */}
              <Grid container item direction='row' textAlign='center' justifyContent='center' gap={2} >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <CustomInput label='User Name' name='username' type='text' variant={variant} id="outlined-username" />
                <CustomInput label='E Mail' name='email' type='email' variant={variant} id="outlined-email" />
                </Stack>
                <CustomInput label='Mobile' name='phone' type='number' variant={variant} id="outlined-phone" />
                <CustomInput label='PIN Code' name='pincode' type='text' fullWidth variant={variant} id="outlined-pincode" />
                <CustomInput label='Location' name='location' type='text' fullWidth variant={variant} id="outlined-location" />
                <CustomInput label='Alternate Mobile' name='altMobile' type='number' fullWidth variant={variant} id="outlined-alt" />
                <Grid container item direction='column' alignItems='center' xs={12} textAlign='center' justifyContent='center'>
                  {!complete && <LoadingButton sx={{ mb: 2 }} variant='contained' type='submit' color={props.isValid ? 'primary' : 'error'}
                    loading={props.isSubmitting} > Submit </LoadingButton>}
                  {complete && <Alert variant='filled' severity='success' > Details Updated <strong>Successfully !</strong> </Alert>}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        {/* Close FORM Content  */}
      </Grid>
    </div>
  );
}
