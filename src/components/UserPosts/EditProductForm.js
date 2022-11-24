import * as Yup from 'yup';
import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { doc,  updateDoc } from "firebase/firestore"
import Compressor from 'compressorjs';
// @mui
import { Button, Alert, Tooltip, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../Iconify';
import { db, storage } from 'src/Contexts/firebaseConfig';
import { useContext } from 'react';
import { Form, Formik } from 'formik';
import CustomInput, { CustomSelect } from 'src/components/hook-form/CustomInput';
import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytes } from 'firebase/storage';
import { User } from 'src/Contexts/UserContext';

// ----------------------------------------------------------------------
export const selectValues = ['Electronics', 'Gadgets', 'Buildings', 'Land', 'Apartments', 'Bikes', 'Cars', 'Laptop', 'Cycles', 'Desktop',
    'Wallpapers', 'Art', 'Scooters', 'Furnitures', 'Office', 'IT Equipments', 'Tools', 'Others']
export default function EditProductForm({value}) {
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false)
    // const { image, setImage, setImage2 } = useContext(ImgView)
    const [ setImage, setImage2, product ] = value
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
        description: Yup.string().min(10, 'Description too short').max(70, 'Description Must be a max of 40 Characters '),
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

    const compress = (image) => {
        return new Promise(async (resolve, reject) => {
            new Compressor(image, {
                quality: 0.6,
                strict: true,
                maxWidth: 2000,
                maxHeight: 2000,
                success(result) {
                    resolve(result)
                }
            })
        })
    }

    const handlePost = async (values, actions) => {
        console.log('logging final VALUES', values)
        console.log('logging actions', actions)
        const { name, category, price, image, description } = values
        let compressed = await compress(image)
        setImage2(compressed)
        console.log(compressed, ':: logging compressed before');
        const imageRef = ref(storage, `/productImages/${name + image.name}`)
        console.log(product.docId,product.url);
        const delRef = ref(storage, product.url)
        const metadata = await getMetadata(delRef)
        await deleteObject(ref(storage, metadata.fullPath))
        console.log('Deleted File');
        const docRef = doc(db, 'products', product.docId)
        console.log('end line');
        uploadBytes(imageRef, compressed).then((snap) => {
            console.log('upload Complete', snap);
            getDownloadURL(snap.ref).then((url) => {
                console.log('fetched URL', url);
                updateDoc(docRef, {
                    name,
                    category,
                    price,
                    url,
                    userId: user.uid,
                    description,
                    editDate: new Date().toLocaleString(),

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
                initialValues={{ name: product.name, category: product.category, price: product.price, image: undefined,
                     description: product.description }}
                validationSchema={formSchema}
                onSubmit={handlePost}
            >
                {props => (

                    <Form >
                        {/* {console.log(props)} */}
                        <div style={{ float: 'right' }}> <Tooltip title="Clear Fields">
                            <IconButton color="primary" onClick={() => { props.handleReset();setImage(null) }}>
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
                        <CustomInput
                            label='Description'
                            name='description'
                            type='text'
                            multiline
                            minRows={3}
                            fullWidth
                            variant="filled"
                            id="outlined-description"
                        />

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
                        <h6 className='errorInput p' style={{ marginLeft: '0.4rem' }} > {props.errors.image} </h6>
                        <LoadingButton type='submit' color='success' variant='contained' fullWidth disabled={!props.isValid}
                            loading={props.isSubmitting} >
                            <span className={props.isValid ? 'textWhite' : 'textBlack'}> Submit</span> </LoadingButton>

                    </Form>
                )}
            </Formik>

        </div>
    )
}
