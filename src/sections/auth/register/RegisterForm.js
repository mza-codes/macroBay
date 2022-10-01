import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { app, auth, db } from 'src/Contexts/firebaseConfig';
// import { useContext } from 'react';
// import { FirebaseContext } from 'src/Contexts/FirebaseContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  // const {app } = useContext(FirebaseContext)
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMsg] = useState('')

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().min(5, 'Username too short').max(15, 'Username limit character exceeds').required('UserName is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().min(9, 'Mobile Number not valid').max(15, 'Invalid Mobile Number').required('Mobile Number is required'),
    pincode: Yup.string().min(6, 'Pincode Must be 6 Characters').max(6, 'Pincode Must be 6 Characters')
      .required('PIN Code is required'),
    location: Yup.string().min(3, 'Must be a minimum of 3 Characters').max(20, 'Must not exceed 20 Characters')
      .required('Location Required to Continue'),
    altMobile: Yup.string().min(9, 'Mobile Number not valid').max(15, 'Invalid Mobile Number'),
    password: Yup.string().min(5, 'Must be a minimum of 5 Characters').max(15, 'Must be within 15 Characters').required('Required')
  })

  const defaultValues = {
    username: '',
    email: '',
    password: '',
    phone: '',
    altMobile: '',
    location: '',
    pincode: ''
  }

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (props) => {
    console.log(props)
    createUserWithEmailAndPassword(auth, props.email, props.password).then((result) => {
      console.log('logging result CREATED USER WITH EMAIL&PASSWORD',result.user);
      console.log(result)
      // result.user.updateProfile({ displayName: props.username })
      const joinDate = new Date().toLocaleString()
      let v = Math.floor((Math.random() * 24) + 1)
      let avatar = `/static/mock-images/avatars/avatar_${v}.jpg`
      updateProfile(result.user, { displayName: props.username, photoURL: avatar }).then(() => {
        addDoc(collection(db, 'webusers'), {
          id: result.user.uid,
          username: props.username,
          email: props.email,
          phone: props.phone,
          altMobile: props.altMobile,
          location: props.location,
          pincode: props.pincode,
          joinDate
        }).then((response) => {
          console.log('CHECK DOC ID',response);
          navigate('/', { replace: true });
          // route.push('/')
          // alert('complete')
        }).catch((err) => { console.log(err); setErrorMsg(err.message) })
      }).catch((err) => { console.log(err); setErrorMsg(err.message) })
    }).catch((err) => { setErrorMsg(err.message ? err.message : err.code); console.log(err) })
    navigate('/dashboard/profile', { replace: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="username" label="UserName" />
          <RHFTextField name="phone" type='number' label="Mobile Number" />
        </Stack>

        <RHFTextField name="email" label="Email Address" />
        <RHFTextField name="location" label="Location" />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="pincode" type='number' label="Pin Code" />
          <RHFTextField name="altMobile" type='number' label="Atl mobile" />
        </Stack>


        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography className='errorText'>{errorMessage}</Typography>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
