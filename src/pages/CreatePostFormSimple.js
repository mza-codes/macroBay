import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Button, Alert, InputAdornment, Tooltip, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../components/Iconify';
import { db, storage } from 'src/Contexts/firebaseConfig';
import { useContext } from 'react';
import { ImgView } from './CreatePost';
import { Form, Formik, useField } from 'formik';
import CustomInput, { CustomSelect } from 'src/components/hook-form/CustomInput';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { User } from 'src/Contexts/UserContext';

// ----------------------------------------------------------------------
export const selectValues = ['Electronics', 'Gadgets', 'Buildings', 'Land', 'Apartments', 'Bikes', 'Cars', 'Laptop', 'Cycles', 'Desktop', 'Other']
export default function PostForm() {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    const { image, setImage, setImage2 } = useContext(ImgView)
    const { user } = useContext(User)
    const FILE_SIZE = 6001200;
    const SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/bmp",
        "image/png",
        "image/webp",
        "image/svg",
    ];
    const formSchema = Yup.object().shape({
        name: Yup.string().min(5, 'Product Name too short').max(20, 'Invalid Product Name').required('Required Field'),
        price: Yup.string().min(3, 'Price too Short').max(7, 'Price too High').required('Required Field'),
        category: Yup.string().oneOf(selectValues, 'Invalid Selection').required('Required Field'),
        image: Yup.mixed().required("Required")
            .test(
                "fileFormat",
                "Unsupported Format",
                value => value && SUPPORTED_FORMATS.includes(value.type)
            ).test(
                "fileSize",
                "File too Large",
                value => value && value.size <= FILE_SIZE
            )
    })

    const handlePost = (values, actions) => {
        console.log('logging final VALUES', values)
        console.log('logging actions', actions)
        const { name, category, price, image } = values
        const imageRef = ref(storage, `/productImages/${name + image.name}`)
        uploadBytes(imageRef, image).then((snap) => {
            console.log('upload Complete', snap);
            getDownloadURL(snap.ref).then((url) => {
                console.log('fetched URL', url);
                addDoc(collection(db, 'products'), {
                    name,
                    category,
                    price,
                    url,
                    userId: user.uid,
                    postDate: new Date().toLocaleString()
                }).catch((err) => console.log(err))
            }).catch((err) => console.log(err))
        }).catch((err) => console.log(err))

        setSuccess(true)
        setTimeout(() => {
            setSuccess(false);
        }, 5000);
        setTimeout(() => {
            navigate('/')
        }, 1000);
    }

    return (
        <div>
            {success && <Alert sx={{ mt: 2 }} variant="filled" severity="success" color="success">
                Item Listed for Sale <strong>Successfully</strong>
            </Alert>}
            <Formik
                initialValues={{ name: '', category: '', price: '', image: undefined }}
                validationSchema={formSchema}
                onSubmit={handlePost}
            >
                {props => (
                    
                    <Form >
                        {/* {console.log(props)} */}
                        <div style={{float:'right'}}> <Tooltip title="Clear Fields">
                            <IconButton color="primary" onClick={() => { props.handleReset() }}> 
                                <Iconify icon="pajamas:clear-all" width={20} height={20} />
                            </IconButton>
                        </Tooltip></div>
                        <CustomInput
                            label='Product Name'
                            name='name'
                            type='text'
                            fullWidth
                            id="filled-name"
                            variant="filled"
                        />
                        <CustomInput
                            label='Price'
                            name='price'
                            type='number'
                            fullWidth
                            variant="filled"
                            id="outlined-price"
                        />
                        <CustomSelect
                            label='Category'
                            name='category'
                            select
                            multiple
                            fullWidth
                            variant="filled"
                            // focused
                            id="outlined-category"
                        />
                        {/* <Input type='file' name='file' onChange={(e)=>{props.setFieldValue('file',e.target.files[0])}}></Input> */}
                        {/* <CustomInput
                            label='Image'
                            name='file'
                            type='file'
                            fullWidth
                            variant="filled"
                            id="outlined-file"
                            onChange={(e)=>{props.setFieldValue('image',e.target.files[0])}}
                        // onChange={(e)=>{setImage(e.target.files[0]);console.log('ONCHSNGE CALLED',props.values,e.target.files[0])}}
                        /> */}
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            disabled={props.values.image && SUPPORTED_FORMATS.includes(props.values.image.type)}
                            // color='primary'
                            color={props.errors.image ? 'warning' : 'primary'}
                            sx={{ mt: 1 }}
                        >
                            {props.errors.image ? <> {props.errors.image} &nbsp;<Iconify icon='bx:error' width={20} height={20} /> </>
                                : props.values.image ? <> <span className='successInput'>Success &nbsp; </span> <Iconify
                                    icon='flat-color-icons:ok' width={24} height={24} /> </>
                                    : <> Upload Files &nbsp; <Iconify icon="line-md:cloud-upload-loop" width={23} height={23} /> </>}
                            <input
                                // required
                                type="file"
                                multiple
                                name='image'
                                accept='image/*'
                                hidden
                                onChange={(e) => { props.setFieldValue('image', e.target.files[0]); setImage(e.target.files[0]); }}
                            />
                        </Button>
                        <h6 className='errorInput p' style={{marginLeft:'0.4rem'}} > {props.errors.image} </h6>
                        <LoadingButton type='submit' color='success' variant='contained' fullWidth disabled={!props.isValid}
                            loading={props.isSubmitting} >
                            <span className={props.isValid ? 'textWhite' : 'textBlack'}> Submit</span> </LoadingButton>
                            
                    </Form>
                )}
            </Formik>

        </div>
    )
}
