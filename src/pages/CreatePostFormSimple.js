import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Typography, MenuItem, InputLabel, Select, Button, FormHelperText, TextField, Input } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../components/Iconify';
// import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { FormProvider, RHFTextField } from '../components/hook-form'
import { app, auth, db } from 'src/Contexts/firebaseConfig';
import { useContext } from 'react';
import { ImgView } from './CreatePost';
import { forEach, max } from 'lodash';
import { Form, Formik, useField } from 'formik';
import CustomInput, { CustomSelect } from 'src/components/hook-form/CustomInput';

// ----------------------------------------------------------------------

export default function PostForm() {
    const navigate = useNavigate();
    // const {app } = useContext(FirebaseContext)
    const [submitState, setSubmitState] = useState(true)
    // const [category, setCategory] = useState('');
    // const [price, setPrice] = useState('')
    // const [name, setName] = useState('')
    const { image, setImage, setImage2 } = useContext(ImgView)
    const [propImg, setPropImg] = useState(null)
    const [errorMessage, setErrorMsg] = useState('')
    // return (
    //     <FormProvider>
    //         <Stack spacing={3}>
    //             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
    //                 <TextField fullWidth required onChange={(e) => { setName(e.target.value) }} value={name} label="Product Name" />
    //             </Stack>
    //             <InputLabel>Category</InputLabel>

    //             <Select
    //                 required
    //                 labelId="Category"
    //                 value={category}
    //                 name='category'
    //                 // label="Category"
    //                 placeholder='Category'
    //                 onChange={(e) => { setCategory(e.target.value); }}
    //             >
    //                 <MenuItem>
    //                     <em>None</em>
    //                 </MenuItem>
    //                 <MenuItem value='Building'>Building</MenuItem>
    //                 <MenuItem value='Apartments'>Apartments</MenuItem>
    //                 <MenuItem value='Vehicles'>Vehicles</MenuItem>
    //                 <option value="Electronics">Electronics</option>
    //                 <option value="Gadgets">Gadgets</option>
    //                 <option value="Buildings">Buildings </option>
    //                 <option value="Property">Property</option>
    //                 <option value="Bikes"> Bikes </option>
    //                 <option value="Cars"> Cars </option>
    //                 <option value="Laptop"> Laptop </option>
    //                 <option value="Cycles"> Cycles </option>
    //                 <option value="Other"> Other </option>
    //             </Select>
    //             <Button
    //                 variant="contained"
    //                 component="label"
    //                 color='warning'
    //             >
    //                 Upload File
    //                 <input
    //                     // required
    //                     required
    //                     type="file"
    //                     multiple
    //                     accept='image/*'
    //                     hidden
    //                     onChange={(e) => { setImage(e.target.files[0]); setPropImg(e.target.files[0]) }}
    //                 />
    //             </Button>
    //             {/* <RHFTextField name="category" label="Product Category" /> */}
    //             {/* <select name="category" onChange={(e) => { setCategory(e.target.value); }} >
    //                 <option disabled >Choose your option </option>
    //                 <option value="Electronics">Electronics</option>
    //                 <option value="Gadgets">Gadgets</option>
    //                 <option value="Buildings">Buildings </option>
    //                 <option value="Property">Property</option>
    //                 <option value="Bikes"> Bikes </option>
    //                 <option value="Cars"> Cars </option>
    //                 <option value="Laptop"> Laptop </option>
    //                 <option value="Cycles"> Cycles </option>
    //                 <option value="Other"> Other </option>
    //             </select> */}
    //             <TextField required value={price} type='number' onChange={(e) => { setPrice(e.target.value) }} label="Price" />
    //             <Typography className='errorText'>{errorMessage && errorMessage}</Typography>
    //             <Button color='info' variant="contained" onClick={() => { setSubmitState(!submitState) }} >Validate</Button>
    //             <LoadingButton disabled={submitState} color='secondary' fullWidth size="large"
    //                 onClick={handleSubmission} variant="contained" loading={submitState}>
    //                 Submit
    //             </LoadingButton>
    //         </Stack>
    //     </FormProvider>
    // );
    ///
    // onSubmit={props.handleSubmit}<input
    //                         type="text"
    //                         onChange={props.handleChange}
    //                         onBlur={props.handleBlur}
    //                         value={props.values.name}
    //                         name="name"
    //                     />
    const selectValues = ['Electronics', 'Gadgets', 'Buildings', 'Apartments', 'Bikes', 'Cars', 'Laptop', 'Cycles', 'Desktop', 'Other']
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
        name: Yup.string().min(5, 'Product Name too short').max(15, 'Invalid Product Name').required('Required Field'),
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


    return (
        <div>
            <Formik
                initialValues={{ name: '', category: '', price: '', image: undefined }}
                validationSchema={formSchema}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        actions.setSubmitting(false);
                    }, 1000);
                }}
            >
                {props => (

                    <Form > {console.log('LOGGIN MAIN PROPS', props.values)}
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
                        {/* <h6 className="successInput"> {props.values.image && 'Success'}</h6> */}
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            disabled={props.values.image}
                            // color='primary'
                            color={props.errors.image ? 'warning' : 'primary'}
                            sx={{ mt: 1 }}
                        >
                            {props.errors.image ? <> {props.errors.image} &nbsp;<Iconify icon='bx:error' width={20} height={20} /> </>
                                : props.values.image ? <> <span className='successInput'>Success &nbsp; </span> <Iconify 
                                icon='icon-park:success' width={23} height={23} /> </>
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
                        <h6 className='errorInput p'> {props.errors.image} </h6>

                        {/* <CustomSelect label='Category' name='category'>
                            <option value="hythanm">hythanm</option>
                            <option value="local">local</option>
                            <option value="goper">goper</option>

                        </CustomSelect> */}
                        {/* <TextField
                            id="filled-select-category"
                            // select
                            label="Category"
                            name='category'
                            // value={category}
                            fullWidth
                            defaultValue=''
                            onChange={(e)=>console.log(e.target.value)}
                            // value={currency}
                            // onChange={handleChange}
                            helperText="Please select your currency"
                            variant="filled"
                        >
                            <MenuItem disabled value=''> Please Select a Category </MenuItem>
                            {selectValues.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField> */}

                        {/* {selectValues.map((value) => {
                            console.log(value);
                        })} */}
                        {/* {props.errors.name && <div id="feedback">{props.errors.name}</div>} */}
                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
