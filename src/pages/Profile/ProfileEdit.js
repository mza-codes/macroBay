import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Form, Formik } from 'formik';
import { Container } from '@mui/system';
import { Alert, Grid, IconButton, Typography } from '@mui/material';
import * as Yup from 'yup'
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/Contexts/firebaseConfig';
import { LoadingButton } from '@mui/lab';
import CustomInput from 'src/components/hook-form/CustomInput';
import Iconify from 'src/components/Iconify';
import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { useContext } from 'react';
import { useAuthContext, User } from 'src/Contexts/UserContext';

export default function EditProfile({ actions }) {
  console.log("editProfileactrions", actions);
  const [complete, setComplete] = useState(false);
  const { setUserData } = useAuthContext();
  const { user } = useContext(User);
  const { popup: open, setPopup: setOpen, userData, updated, setUpdated } = actions;
  const { docId } = userData;
  let { username, email, phone, pincode, location, altMobile } = userData;
  if (pincode === undefined || null) { pincode = '' }
  if (location === undefined || null) { location = '' }
  if (altMobile === undefined || null) { altMobile = '' }
  // const [open, setOpen] = React.useState(false);
  console.log('logging Altered Values :::', username, email, phone, pincode, location, altMobile);
  const handleClose = () => {
    if (window.confirm('Entered Data Will be Lost! Continue ?')) {
      setOpen(false);
    };
  };

  const profileSchema = Yup.object().shape({
    username: Yup.string().min(5, 'Username too short').max(15, 'Username limit character exceeds').required('UserName is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().min(9, 'Mobile Number not valid').max(15, 'Invalid Mobile Number').required('Mobile Number is required'),
    pincode: Yup.string().min(6, 'Pincode Must be 6 Characters').max(6, 'Pincode Must be 6 Characters')
      .required('PIN Code is required'),
    location: Yup.string().min(3, 'Must be a minimum of 3 Characters').max(20, 'Must not exceed 20 Characters')
      .required('Location Required to Continue'),
    altMobile: Yup.string().min(9, 'Mobile Number not valid').max(15, 'Invalid Mobile Number')
  });

  const handleUpdate = async (values, actions) => {
    console.log('Updating User Data')
    console.log(values);
    console.log('logging DOC ID', docId)
    const docRef = doc(db, 'webusers', docId)
    const { username, phone, email, location, pincode, altMobile } = values
    const updateData = {
      username,
      docId,
      phone,
      email,
      location,
      pincode,
      altMobile
    };
    await updateDoc(docRef, updateData)
      .then(async (response) => {
        console.log(response);
        setUserData((current) => ({ ...current, ...updateData }));
        await updateProfile(user, { displayName: username });
        setComplete(true);
        setUpdated(true);
        setTimeout(() => {
          setOpen(false)
        }, 2500);
      }).catch((err) => { console.log("Error Updating UserData", err) })
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogActions>
          <IconButton
            onClick={handleClose}
            color='error' > <Iconify icon='eva:close-square-fill' />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <Container maxWidth='lg'>
            <Grid container item xs={12} direction='column' justifyContent='center' textAlign='center'
              alignContent='center' alignItems='center' gap={2}>
              <Grid item xs={12}>
                <Typography variant='h6'>Edit Your Details </Typography>
                <DialogContentText>
                  Edit Your Profile Details from Here
                </DialogContentText>
              </Grid>

              <Formik initialValues={{
                username: username, email: email, pincode: pincode, phone: phone, location: location, altMobile: altMobile
              }}
                validationSchema={profileSchema} onSubmit={handleUpdate} >
                {props => (
                  <Form spellCheck >
                    {/* {console.log(props)} */}
                    <Grid container item direction='row' textAlign='center' justifyContent='center' gap={2} >
                      <CustomInput label='User Name' name='username' type='text' variant="filled" id="outlined-username" />
                      <CustomInput label='E Mail' name='email' type='email' variant="filled" id="outlined-email" />
                      <CustomInput label='Mobile' name='phone' type='number' variant="filled" id="outlined-phone" />
                      <CustomInput label='PIN Code' name='pincode' type='text' fullWidth variant="filled" id="outlined-pincode" />
                      <CustomInput label='Location' name='location' type='text' fullWidth variant="filled" id="outlined-location" />
                      <CustomInput label='Alternate Mobile' name='altMobile' type='number' fullWidth variant="filled" id="outlined-alt" />
                      <Grid container item direction='column' alignItems='center' xs={12} textAlign='center' justifyContent='center'>
                        {!complete && <LoadingButton sx={{ mb: 2 }} variant='contained' type='submit' color={props.isValid ? 'primary' : 'error'}
                          loading={props.isSubmitting} > Submit </LoadingButton>}
                        {complete && <Alert variant='filled' severity='success' > Details Updated <strong>Successfully !</strong> </Alert>}
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </div>
  );
}
