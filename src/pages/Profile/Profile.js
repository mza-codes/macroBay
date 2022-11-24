import { Alert, Box, Button, Grid, IconButton, MenuItem, styled, TextField, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { updateProfile } from "firebase/auth";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import { useAuthContext } from "src/Contexts/UserContext";
import account from "src/_mock/account";
import * as Yup from 'yup'
import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "src/Contexts/firebaseConfig";
import { collection, doc, getDocs, query, updateDoc, where, } from "firebase/firestore";
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
    const { userData, user, setUserData } = useAuthContext()
    const [image, setImage] = useState()
    const [uploadErr, setUploadErr] = useState(false);
    const [profileArray, setProfileArray] = useState([])
    const [option, setOption] = useState('cover')
    const [tick, setTick] = useState(false)
    const [complete, setComplete] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [docId, setDocId] = useState()
    const [popup, setPopup] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [profile, setProfile] = useState({
        touched: false,
        image: undefined,
    })
    const navigate = useNavigate()
    const [disabled, setDisabled] = useState(false);

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

    const storeData = async (key) => {
        const docRef = doc(db, 'webusers', docId)
        const value = {
            avatar: user.photoURL,
            profileKey: key,
            docId
        }
        await updateDoc(docRef, value)
            .then((response) => {
                console.log(response);
                setUserData((curr) => ({ ...curr, ...value }));
            })
            .catch((err) => { console.log(err); })
        setComplete(true)
        setTimeout(() => {
            setComplete(false)
            navigate('/')
        }, 2500);
    };

    const showProfiles = () => {
        setProfile({ touched: true })
        let values = []
        for (let i = 1; i < 25; i++) {
            values.push(i)
        };
        setProfileArray(values)
    };

    const setProfileImg = (i) => {
        let prof = `/static/mock-images/avatars/avatar_${i}.jpg`
        setImage(prof)
        setTick(true)
    };

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
            const delRef = ref(storage, user.photoURL)
            let metadata = await getMetadata(delRef)
            console.log(metadata);
            console.log(metadata.fullPath);
            await deleteObject(ref(storage, metadata.fullPath))
        }
        setUploadErr(false);

        await updateProfile(user, { photoURL: image })
        console.log(user)
        let key = 'localAvatar'
        storeData(key)
        setLoading2(false);
    };

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
    });

    // fetchUserDoc for profile Updation
    const fetchUserData = async (currentUser) => {
        console.log("Fetching UserData");
        let docData, docID;
        const q = query(collection(db, 'webusers'), where('id', '==', currentUser.uid));
        await getDocs(q).then((result) => {
            console.log(result)
            if (result.docs.length === 0) {
                console.log('if true entered docs length ===0 ');
                setUserData({
                    docId: null,
                });
                setDisabled(true);
                return false;
            };
            result.forEach((doc) => {
                docID = doc.id
                docData = doc.data()
            });
            setDisabled(false);
            setDocId(docID);
            setUserData({
                docId: docID,
                ...docData
            });
        }).catch((err) => { console.log(err); });
    };

    useEffect(() => {
        console.log("checking if userData", userData);
        if (userData?.docId === null) {
            console.log("docId is Null");
            fetchUserData(user);
        };
    }, []);

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
        storeData(key, url);
    };

    const ErrLog = <Iconify icon='bxs:message-square-error' color='red' width={20} height={20} />

    return (
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
                                    <strong> Successfully ! </strong>
                                </Alert>}
                            {loading2 && <div className="loaderSmall" />}
                            {uploadErr &&
                                <Typography variant="overline" color='error' > Please Use the Preferred Confim Button
                                    for Update by File Upload
                                </Typography>}
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
                                <div style={styles.overlay}>
                                    <IconButton disabled={profile.touched} onClick={showProfiles} ><div >
                                        <Iconify icon='flat-color-icons:edit-image' width={25} height={25} /></div>
                                    </IconButton>
                                </div>
                                {tick &&
                                    <IconButton onClick={confirmUpdate} color="success" disabled={disabled}
                                        sx={{ float: 'right', mt: 1 }}>
                                        <Iconify icon='charm:circle-tick' />
                                    </IconButton>}
                            </div>
                        </Grid>

                        <Grid container direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start" item xs={12} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }} md={6} >
                            {user && <>
                                <Typography m={0.2} variant="subtitle1"> Name: {user.displayName} </Typography>
                                <Typography m={0.2} variant="subtitle2"> E-Mail: {user.email} </Typography>
                                {userData &&
                                    <>
                                        <Typography m={0.2} variant="subtitle2"> Phone: {userData.phone || ErrLog}</Typography>
                                        <Typography m={0.2} variant="subtitle2"> Alt Mobile: {userData.altMobile || ErrLog} </Typography>
                                        <Typography m={0.2} variant="subtitle2"> Pin Code: {userData.pincode || ErrLog} </Typography>
                                        <Typography m={0.2} variant="subtitle2"> Location: {userData.location || ErrLog} </Typography>
                                    </>}
                            </>}
                            {updated ?
                                <IconButton color="success" sx={{ float: 'right', mt: 1 }}>
                                    <Iconify icon='charm:circle-tick' />
                                </IconButton> :
                                <> <IconButton disabled={disabled} sx={{ mt: 2.5 }} onClick={() => { setPopup(true) }} >
                                    <Iconify icon='fa-solid:user-edit' />
                                </IconButton>
                                    {disabled &&
                                        <Typography m={1} variant="overline" color='error' >
                                            User Data Not Found in Database!
                                        </Typography>}
                                </>
                            }
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
                                                <input type="file" accept="image/*"
                                                    onChange={e => {
                                                        props.setFieldValue('image', e.target.files[0]);
                                                        setImage(URL.createObjectURL(e?.target?.files[0]));
                                                    }}
                                                    hidden name="avatar" />
                                                <Iconify icon='eva:cloud-upload-fill' width={28} height={28} />
                                                Upload Your Avatar
                                            </Button>
                                            <Typography color='error' variant="overline" m={2} >{props.errors.image}</Typography>
                                            <Button type="submit" variant="contained" disabled={loading2 || disabled}
                                                color={props.errors.image && 'error'} > {props.values.image && props.isValid
                                                    ? <> <Iconify icon='ep:success-filled' /> Confirm </>
                                                    : 'Submit'}
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            </Box>

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
                    </Grid>
                </div>
            </Container>
        </Page>
    )
}