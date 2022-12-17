import { Box, Button, Grid, IconButton, styled, TextField, Tooltip, Typography } from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import lozad from "lozad";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout";

const ProfileImg = styled('img')({
    top: 0,
    maxWidth: '440px',
    maxHeight: '340px',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

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

export default function ImageView() {
    const route = useNavigate()
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState()
    const [image2, setImage2] = useState()
    const [image3, setImage3] = useState()
    const [show, setShow] = useState(false)
    const [pic, setPic] = useState(null)
    const [fetchErr, setFetchErr] = useState(false)
    const [err, setErr] = useState(null)
    const [imgHeight, setHeight] = useState('300')
    const [imgWidth, setWidth] = useState('500')
    const [resultImg, setResultImg] = useState(null)
    const [imgCollection, setImgCollection] = useState([])
    const [showCollection, setShowCollection] = useState(false);

    const observer = lozad();

    const getImg = async () => {
        console.log('getimg called')
        const data = 'https://source.unsplash.com/random'
        image ? setImage2(image) : setImage2(data);
        image2 && setImage3(image2);

        axios.get(data).then((response) => {
            const url = response.request.responseURL;
            setImage(url);
            return;
        }).catch((err) => {
            console.log(err)
            setErr('Axios Get Error', err);
            return;
        });
    };

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
        if (width <= 5000 && height <= 5000 &&
            width >= 150 && height >= 150) {
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
                    setFetchErr(true)
                    setLoading(false)
                    setErr('Fetch Failed, Please Try Running Again !')
                } else {
                    console.log('response OK ');
                    setLoading(false)
                    setFetchErr(false)
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
                }
            }).catch(err => {
                setErr('Catched Error: ', err)
                console.log(err);
                setFetchErr(true)
                setLoading(false)
            });

        } else {
            console.log('falseState');
            setLoading(false)
            setErr('Width And Height must be within 150-5000 Range !')
        };
    };

    const renderImg = () => {
        const localImgs = localStorage.getItem('picusm-list');
        if (localImgs) {
            setImgCollection(JSON.parse(localImgs));
            setShowCollection(true);
            return
        };

        console.log('renderImg Called');
        let dataUrl = 'https://picsum.photos/v2/list?page=2&limit=100'
        axios.get(dataUrl).then((res) => {
            console.log('data fetched', res);
            setImgCollection(res.data);
            localStorage.setItem('picusm-list', JSON.stringify(res.data));
            setShowCollection(true)
        });
    };

    const viewImage = (picture) => {
        console.log(picture);
        sessionStorage.setItem('imageSingle', JSON.stringify(picture))
        route('/imagesingle')
    };

    useEffect(() => {
        getImg();
    }, []);

    useEffect(() => {
        observer.observe();
    });

    return (
        <div>
            <Page title='Image Collection'>
                <LogoOnlyLayout />
                <Container sx={{ pt: 2 }} maxWidth='xl'>
                    {/* <div className="nativeCard"> */}
                    <Grid container
                        direction="row"
                        justifyContent="center"
                        alignItems="center" spacing={2}>
                        <Grid item xs={12} md={12}>
                            <Typography variant="h3" textAlign='center' >
                                Image Collection
                            </Typography>
                            <Tooltip title='Get New images'>
                                <Box sx={{ textAlign: 'center' }}>
                                    <IconButton onClick={getImg} >
                                        <Iconify icon='fluent:arrow-sync-circle-24-filled' width={24} height={24} />
                                    </IconButton>
                                </Box>
                            </Tooltip>
                        </Grid>
                        <Grid container
                            direction="column"
                            justifyContent="center"
                            alignItems="center" item xs={12} md={4} >
                            <div style={styles.card}>
                                <ProfileImg className="lozad" id="img" data-src={image} alt="image" />
                            </div>
                        </Grid>
                        <Grid container direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start" item xs={12} sx={{ alignItems: { xs: 'center', md: 'center' } }} md={4} >
                            <div>
                                {image2 && <ProfileImg className="lozad" id="img" data-src={image2} alt="Previous Image" />}
                            </div>
                        </Grid>
                        <Grid container direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start" item xs={12} sx={{ alignItems: { xs: 'center', md: 'center' } }} md={4} >
                            <div style={styles.card}>
                                {image3 && <ProfileImg className="lozad" id="img" data-src={image3} alt="Previous Image" />}
                            </div>
                        </Grid>
                        <Grid container item xs={12} direction='column' justifyContent="center"
                            alignItems="center">
                            <Button onClick={() => { setShow(!show) }} >Get Random Image</Button>
                            <Button onClick={renderImg} disabled={showCollection} color='foggy' >Show Image Collection </Button>
                            {show && <Typography margin={2} variant="h4"> Get Random Picture</Typography>}

                        </Grid>
                        {show && <Grid container mt={3}
                            direction="column"
                            justifyContent="center"
                            alignItems="center" gap={1} item xs={12} md={6} >
                            {/* <Typography variant="subtitle1"> Get Randome Picture</Typography> */}
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
                                </Button>
                            }
                        </Grid>}
                        {loading && <Grid container item direction="column"
                            justifyContent="center"
                            alignItems="center" xs={12} md={6}>
                            <div className="loader" /> <Typography mb={0.5} variant="overline">
                                Fetching Data </Typography> </Grid>}

                        {pic && show && !loading && <>
                            <Grid container
                                direction="column"
                                justifyContent="center"
                                alignItems="center" item xs={12} md={6} >

                                <Typography mb={0.5} variant="overline"> Result </Typography>
                                <div style={styles.card} >
                                    {/* <img src='myimage.png' border={0} /> */}
                                    <ProfileImg className="lozad" data-src={pic} alt="Search Result" />
                                    {/* <a href={pic} download > Download Image </a> */}
                                </div>
                            </Grid>
                        </>}
                        {showCollection && <Grid container
                            direction="column"
                            justifyContent="center"
                            alignItems="center" item xs={12}>
                            <Typography margin={2} variant="h4"> Viewing Collection</Typography>
                        </Grid>}
                        {imgCollection && imgCollection.map((item) => {
                            return (
                                <Grid container key={item.id} direction="column" justifyContent="center"
                                    alignItems="center" item xs={12} md={6} lg={4} onClick={() => { viewImage(item) }} >
                                    {/* <Box key={item.id} sx={{ position: 'relative' }}> */}
                                    <ProfileImg className="lozad" data-src={item.download_url} alt={item.author} />
                                    {/* </Box> */}
                                    <Typography m={0.5} variant="overline">{item.author}</Typography>
                                </Grid>
                            )
                        })}
                        
                    </Grid>
                </Container>
            </Page>
        </div >
    )
}