import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Typography, MenuItem, InputLabel, Select, Button, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../components/Iconify';
// import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { FormProvider, RHFTextField } from '../components/hook-form'
import { app, auth, db } from 'src/Contexts/firebaseConfig';
import { useContext } from 'react';
import { ImgView } from './CreatePost';
import { forEach } from 'lodash';

// ----------------------------------------------------------------------

export default function PostForm() {
    const navigate = useNavigate();
    // const {app } = useContext(FirebaseContext)
    const [submitState, setSubmitState] = useState(true)
    const [category, setCategory] = useState('');
    const { image, setImage, setImage2 } = useContext(ImgView)
    const [propImg, setPropImg] = useState(null)
    // const [errorMessage, setErrorMsg] = useState('')
    let errorMessage
    const SUPPORTED_FORMATS = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];
    const RegisterSchema = Yup.object().shape({
        name: Yup.string().min(5, 'Product Name too short').max(15, 'Product Name character exceeds').required('Product Name required'),
        // category: Yup.string().min(5, 'Category too short').max(15, 'Category character exceeds').required('Category required'),
        // category: Yup.string().required('Category Invalid'),
        category: Yup
            .string()
            .nullable()
            .required("Please select a Category"),
        image: Yup.mixed()
            .required('Required Field')
            .test(
                'size',
                'File size is too big',
                (value) => value && value.size <= 1024 * 1024 // 5MB
            )
            .test(
                'type',
                'Invalid file format selection',
                (value) =>
                    // console.log(value);
                    !value || (value && SUPPORTED_FORMATS.includes(value?.type))
            ),
        price: Yup.string().min(3, 'Price too short').max(7, 'Price character exceeds').required('Price required'),
    });

    const defaultValues = {
        name: '',
        category: '',
        postDate: new Date().toLocaleString(),
        price: '',
        image: null
        // file: {}
    };

    const methods = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (props) => {
        alert('called')
        props.category = category
        props.image = image
        console.log(props)
        // navigate('/dashboard', { replace: true });
    }

    function validateForm(event) {
        console.log('logging props from validateForm', event);
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <RHFTextField name="name" label="Product Name" />
                </Stack>
                <InputLabel>Category</InputLabel>

                <Select
                    labelId="Category"
                    // id="demo-simple-select-helper"
                    // value={age}
                    value={category}
                    name='category'
                    // label="Category"
                    placeholder='Category'
                    onChange={(e) => { setCategory(e.target.value); }}
                >
                    <MenuItem>
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value='Building'>Building</MenuItem>
                    <MenuItem value='Apartments'>Apartments</MenuItem>
                    <MenuItem value='Vehicles'>Vehicles</MenuItem>
                </Select>
                <Button
                    variant="contained"
                    component="label"
                    color='warning'
                >
                    Upload File
                    <input
                        // required
                        type="file"
                        multiple
                        accept='image/*'
                        hidden
                        onChange={(e) => { setImage(e.target.files[0]); }}
                    />
                </Button>
                {/* <RHFTextField name="category" label="Product Category" /> */}
                {/* <select name="category" onChange={(e) => { setCategory(e.target.value); }} >
                    <option disabled >Choose your option </option>
                    <option value="Electronics">Electronics</option>
                    <option value="Gadgets">Gadgets</option>
                    <option value="Buildings">Buildings </option>
                    <option value="Property">Property</option>
                    <option value="Bikes"> Bikes </option>
                    <option value="Cars"> Cars </option>
                    <option value="Laptop"> Laptop </option>
                    <option value="Cycles"> Cycles </option>
                    <option value="Other"> Other </option>
                </select> */}
                <RHFTextField type='number' name="price" label="Price" />

                <Typography className='errorText'>{errorMessage}</Typography>
                <Button onClick={() => { setSubmitState(false); validateForm() }} >Validate</Button>
                <LoadingButton disabled={submitState} color='success' fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Submit
                </LoadingButton>
            </Stack>
        </FormProvider>
    );

    // return (
    //     <>
        
    //     </>
    // )
}
