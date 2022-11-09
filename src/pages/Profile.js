import { Alert, Box, Button, Grid, IconButton, MenuItem, styled, TextField, Tooltip, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { updateProfile } from "firebase/auth";
import { Form, Formik } from "formik";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import { User } from "src/Contexts/UserContext";
import account from "src/_mock/account";
import * as Yup from 'yup'
import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "src/Contexts/firebaseConfig";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import EditProfile from "./ProfileEdit";
import Compressor from "compressorjs";

const styles = {
    card: {
        position: 'relative',

    },
    overlay: {
        position: 'absolute',
        top: '2px',
        right: '2px'
    },
}

export default function Profile() {
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState()
    const [show, setShow] = useState(false)
    const [pic, setPic] = useState(null)
    const [fetchErr, setFetchErr] = useState(false)
    const [uploadErr, setUploadErr] = useState(false)
    const [err, setErr] = useState(null)
    const [imgHeight, setHeight] = useState('300')
    const [imgWidth, setWidth] = useState('500')
    const [resultImg, setResultImg] = useState(null)
    const [profileArray, setProfileArray] = useState([])
    const [option, setOption] = useState('cover')
    const [tick, setTick] = useState(false)
    const { user, setUser } = useContext(User);
    const [complete, setComplete] = useState(false)
    const [userData, setUserData] = useState(null);
    const [updated, setUpdated] = useState(false)
    const [docId, setDocId] = useState()
    const [popup, setPopup] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [profile, setProfile] = useState({
        touched: false,
        image: undefined,
    })
    const navigate = useNavigate()
    const [disabled, setDisabled] = useState(false)

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
        });
    };

    const AvatarImg = styled('img')({
        top: 0,
        maxWidth: '128px',
        maxHeight: '128px',
        width: '128px',
        height: '128px',
        objectFit: option,
    });

    const ProfileImg = styled('img')({
        top: 0,
        maxWidth: '440px',
        maxHeight: '340px',
        width: '100%',
        height: '100%',
        objectFit: option,
    });

    const handleImg = async () => {
        setLoading(true)
        console.log('hangleimg');
        const width = parseInt(imgWidth)
        const height = parseInt(imgHeight)
        console.log(imgWidth, imgHeight)
        console.log(width, height);
        const values = {
            height: '300',
            width: '500'
        }
        if (width <= 500 && height <= 500 &&
            width >= 30 && height >= 30) {
            console.log('trueState');
            let photo = `https://picsum.photos/${width}/${height}`
            // setPic(photo)
            // setResultImg(URL.createObjectURL(photo))
            // const download = e => {
            console.log(photo);
            await fetch(photo, {
                method: "GET",
                headers: {}
            }).then(response => {
                console.log(response);
                if (response.type === 'basic') {
                    console.log('response null');
                    // setFetchErr(true)
                    setLoading(false)
                    setErr('Fetch Failed, Please Try Running Again !')
                } else {
                    console.log('response OK ');
                    setLoading(false)
                    // setFetchErr(false)
                    setResultImg(response.url)
                    setPic(response.url)
                    console.log('Logging PIC::', pic,
                        '::LOGGING RESULTIMG::', resultImg);
                    // response.arrayBuffer().then(function (buffer) {
                    //     console.log('PRINTING BUFFER', buffer);
                    //     const url = window.URL.createObjectURL(new Blob([buffer]));
                    //     console.log('logging URL', url);
                    //     const link = document.createElement("a");
                    //     console.log('document.createElement("a")::', link);
                    //     link.href = url;
                    //     link.setAttribute("download", "image.png"); //or any other extension
                    //     document.body.appendChild(link);
                    //     link.click();
                    // })
                };
            }).catch(err => {
                setErr('Catched Error: ', err)
                console.log(err);
                // setFetchErr(true)
                setLoading(false)
            });
            // };

        } else {
            console.log('falseState');
            setLoading(false)
            setErr('Width And Height must be within 30-500 Range !')
        };

    };

    const storeData = async (key) => {
        const docRef = doc(db, 'webusers', docId)
        const value = {
            avatar: user.photoURL,
            profileKey: key,
            docId
        }
        await updateDoc(docRef, value)
            .then((response) => console.log(response))
            .catch((err) => { console.log(err); })
        setComplete(true)
        setTimeout(() => {
            setComplete(false)
            navigate('/')
        }, 2500);
    }

    const showProfiles = () => {
        setProfile({ touched: true })
        let values = []
        for (let i = 1; i < 25; i++) {
            values.push(i)
        }
        setProfileArray(values)
    }

    const setProfileImg = (i) => {
        let prof = `/static/mock-images/avatars/avatar_${i}.jpg`
        setImage(prof)
        setTick(true)
    }

    const confirmUpdate = async () => {
        setLoading2(true)
        console.log(image);
        if (image.includes('http://')) {
            console.log('Blob found in image use Submit Button');
            setLoading2(false)
            setUploadErr(true)
            setTick(false)
            return false
        }
        if (user.photoURL && user.photoURL.includes('firebasestorage', 'microbay')) { // use profileKey validation
            console.log('includes');
            console.log('userData logg', userData)
            const delRef = ref(storage, userData.avatar)
            let metadata = await getMetadata(delRef)
            console.log(metadata);
            console.log(metadata.fullPath);
            await deleteObject(ref(storage, metadata.fullPath))
        }
        setUploadErr(false)
        // user.photoURL = image

        await updateProfile(user, { photoURL: image })
        console.log(user)
        let key = 'localAvatar'
        storeData(key)
        setLoading2(false)
        // setTimeout(() => {
        //     setComplete(false)
        //     navigate('/')
        // }, 2000);
    }

    const FILE_SIZE = 5001200;
    const SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/bmp",
        "image/png",
        "image/webp",
        "image/svg",
    ];

    const validateAvatar = Yup.object().shape({
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

    const fetchUserData = async () => {
        let docData, docID
        console.log(user.uid);
        const q = query(collection(db, 'webusers'), where('id', '==', user.uid))
        await getDocs(q).then((result) => {
            console.log(result)
            if (result.docs.length === 0) {
                console.log('if true entered docs length ===0 ');
                setDisabled(true)
                return false
            }
            result.forEach((doc) => {
                docID = doc.id
                docData = doc.data()
            })
            setDocId(docID)
            setUserData(docData)
        }).catch((err) => { console.log(err); })
    };

    useEffect(() => {
        fetchUserData()
    }, [updated])

    const setUploadedImage = async (values) => {
        setLoading2(true)
        setUploadErr(false)
        const { image } = values
        if (user.photoURL && user.photoURL.includes('firebasestorage', 'microbay')) { // use profileKey validation
            console.log('includes');
            const delRef = ref(storage, user.photoURL)
            let metadata = await getMetadata(delRef)
            console.log(metadata);
            console.log(metadata.fullPath);
            await deleteObject(ref(storage, metadata.fullPath))
        }
        let compressed = await compress(image)
        console.log('Updating Profile')

        let dt = new Date().toISOString().toString().split(':', 6)
        let i = dt.length - 1
        let key = dt[i]
        const imageRef = ref(storage, `/userAvatars/${user.displayName + key}`)
        const snap = await uploadBytes(imageRef, compressed)
        console.log('SNAP Found', snap)
        const url = await getDownloadURL(snap.ref)
        console.log('GOT URL', url)
        setLoading2(false)
        setImage(url)
        await updateProfile(user, { photoURL: url })
        storeData(key, url)
        // setComplete(true)
        // setTimeout(() => {
        //     setComplete(false)
        //     navigate('/')
        // }, 2500);
        // setTick(true)
    };

    const ErrLog = <Iconify icon='bxs:message-square-error' color='red' width={20} height={20} />

    return (
        <div>
            <Page title='Profile'>
                <Container>
                    <div className="nativeCard">
                        <Grid container
                            direction="row"
                            justifyContent="center"
                            alignItems="center" spacing={2} mb={1}>
                            <Grid item xs={12} md={12}>
                                <Typography variant="h3" textAlign='center' gutterBottom > Your Profile </Typography>
                            </Grid>
                            <Grid item xs={12} md={12} container
                                direction="coloumn"
                                justifyContent="center"
                                alignItems="center" >
                                {complete &&
                                    <Alert sx={{ mx: 5, mb: 1 }} variant="filled" severity="success" >Profile Update Completed
                                        <strong> Successfully ! </strong></Alert>}
                                {loading2 && <div className="loaderSmall" />}
                                {uploadErr && <Typography variant="overline" color='error' > Please Use the Preferred Confim Button
                                    for Update by File Upload </Typography>}
                            </Grid>

                            <Grid container
                                direction="column"
                                justifyContent="center"
                                alignItems="center" item xs={12} md={6} >
                                <Typography mb={0.5} variant="overline"> Profile Picture </Typography>
                                <hr />
                                <div style={styles.card}>
                                    <ProfileImg id="img" src={user && user.photoURL ? user.photoURL : account.photoURL}
                                        srcSet={image} alt="image" />
                                    <div style={styles.overlay}><IconButton disabled={profile.touched} onClick={showProfiles} ><div >
                                        <Iconify icon='flat-color-icons:edit-image' width={25} height={25} /></div>
                                    </IconButton></div>
                                    {tick && <IconButton onClick={confirmUpdate} color="success" sx={{ float: 'right', mt: 1 }}>
                                        <Iconify icon='charm:circle-tick' /> </IconButton>}

                                </div>
                            </Grid>

                            <Grid container direction="column"
                                justifyContent="flex-start"
                                alignItems="flex-start" item xs={12} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }} md={6} >
                                {user && <> <Typography m={0.2} variant="subtitle1"> Name: {user.displayName} </Typography>
                                    <Typography m={0.2} variant="subtitle2"> E-Mail: {user.email} </Typography>

                                    {userData && <>
                                        <Typography m={0.2} variant="subtitle2"> Phone: {userData.phone || ErrLog}</Typography>
                                        <Typography m={0.2} variant="subtitle2"> Alt Mobile: {userData.altMobile || ErrLog} </Typography>
                                        <Typography m={0.2} variant="subtitle2"> Pin Code: {userData.pincode || ErrLog} </Typography>
                                        <Typography m={0.2} variant="subtitle2"> Location: {userData.location || ErrLog} </Typography>
                                    </>}
                                </>}
                                {/* <Iconify icon='ep:warning-filled' /> */}
                                {updated ? <IconButton color="success" sx={{ float: 'right', mt: 1 }}>
                                    <Iconify icon='charm:circle-tick' />
                                </IconButton> : <> <IconButton disabled={disabled} sx={{ mt: 2.5 }} onClick={() => { setPopup(true) }} >
                                    <Iconify icon='fa-solid:user-edit' />
                                </IconButton> {disabled && <Typography m={1} variant="overline" color='error' >
                                    User Data Not Found in Database! </Typography>} </>
                                }
                                <Button onClick={() => { setShow(!show) }} disabled={disabled} >Get Random Image</Button>
                            </Grid>
                            {/* PopUP Start */}
                            {popup && <EditProfile value={[popup, setPopup, userData, docId, updated, setUpdated]} />}
                            {/* Close PopUP */}
                            <Grid item xs={12} container gap={3} direction='row' justifyContent='center'
                                alignContent='center' textAlign='center' alignItems='center'  >
                                {profile.touched &&
                                    <Grid item xs={12} container direction='row' justifyContent='space-around'
                                        alignContent='center' alignItems='center'>
                                        <TextField variant="outlined" select
                                            onChange={(e) => { setOption(e.target.value) }} value={option} label='Display' >
                                            <MenuItem value='fill' >Fill</MenuItem>
                                            <MenuItem value='cover' >Cover</MenuItem>
                                            <MenuItem value='contain' >Contain</MenuItem>
                                            <MenuItem value='unset' >Unset</MenuItem>
                                            <MenuItem value='initial'  >Initial</MenuItem>
                                        </TextField>

                                        <Typography variant="h6" gutterBottom >Select Your Avatar </Typography>
                                        <IconButton color="error" onClick={() => { setProfile({ touched: false }) }} >
                                            <Iconify icon='eva:close-square-fill' width={24} height={24} /> </IconButton>

                                        {/* eva:cloud-upload-fill */}
                                    </Grid>}
                                {profile.touched && profileArray && profileArray.map((i) => {
                                    return (
                                        <div key={i} className="anime pointer" onClick={() => { setProfileImg(i) }} >
                                            <Grid key={i} container item direction='row' justifyContent="center" alignItems="center">
                                                <AvatarImg key={i} src={`/static/mock-images/avatars/avatar_${i}.jpg`} />
                                            </Grid>
                                        </div>
                                    )
                                })}
                                {/* <Grid item xs={12} container direction='row' justifyContent='space-around'
                                    alignContent='space-around' alignItems='center'> */}
                                <Box sx={{ justifyContent: 'center' }}>
                                    <Formik initialValues={{ image: undefined }} validationSchema={validateAvatar}
                                        onSubmit={setUploadedImage} >
                                        {props => (
                                            <Form>
                                                <Button color={props.errors.image ? 'error' : 'primary'} component="label" >
                                                    <input type="file" accept="image/*" onChange={e => {
                                                        props.setFieldValue('image', e.target.files[0]);
                                                        // setProfile({ image: e.target.files[0] })
                                                        { e.target.files[0] && setImage(URL.createObjectURL(e.target.files[0])) }
                                                    }} hidden name="avatar" />
                                                    <Iconify icon='eva:cloud-upload-fill' width={28} height={28} />
                                                    Upload Your Avatar </Button>
                                                <Typography color='error' variant="overline" m={2} >{props.errors.image}</Typography>

                                                <Button type="submit" variant="contained" disabled={loading2 || disabled}
                                                    color={props.errors.image && 'error'} > {props.values.image && props.isValid ?
                                                        <> <Iconify icon='ep:success-filled' /> Confirm </>
                                                        : 'Submit'}</Button>

                                            </Form>
                                        )}

                                    </Formik>
                                </Box>
                                {/* </Grid> */}

                                {profile.image &&
                                    <Grid container direction="column" justifyContent="center"
                                        alignItems="center" item xs={12} >
                                        <ProfileImg src={URL.createObjectURL(profile.image)} />
                                        <Typography variant="overline" m={2} >Uploaded Image </Typography>
                                        <TextField variant="outlined" select
                                            onChange={(e) => { setOption(e.target.value) }} value={option} label='Display' >
                                            <MenuItem value='fill' >Fill</MenuItem>
                                            <MenuItem value='cover' >Cover</MenuItem>
                                            <MenuItem value='contain' >Contain</MenuItem>
                                            <MenuItem value='unset' >Unset</MenuItem>
                                            <MenuItem value='initial'  >Initial</MenuItem>
                                        </TextField>
                                    </Grid>}
                            </Grid>

                            {show && <Grid container mt={3}
                                direction="column"
                                justifyContent="center"
                                alignItems="center" gap={1} item xs={12} md={6} >
                                <Typography variant="subtitle2"> Enter Picture Dimensions </Typography>
                                <TextField label="Width" onChange={(e) => { setWidth(e.target.value) }}
                                    value={imgWidth} type='number' name='height' />
                                <TextField label="Height" onChange={(e) => { setHeight(e.target.value) }}
                                    value={imgHeight} type='number' name="width" />
                                <Button variant='contained' onClick={handleImg}> Submit </Button>
                                <Typography mb={0.5} variant="caption" color='error'>{err}</Typography>
                                {resultImg &&
                                    <Button onClick={() => { window.open(resultImg, '_blank', 'noopener,noreferrer') }} >
                                        Download Image
                                    </Button>}
                            </Grid>}

                            <Grid container
                                direction="column"
                                justifyContent="center"
                                alignItems="center" item xs={12} md={6} >
                                {loading && <> <div className="loader" /> <Typography mb={0.5} variant="overline">
                                    Fetching Data </Typography> </>}
                                {pic && show && !loading && <> <Typography mb={0.5} variant="overline"> Result </Typography>
                                    <div style={styles.card} >
                                        <ProfileImg src={pic} alt="Search Result" />
                                    </div> </>}
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </Page>
        </div >
    )
}