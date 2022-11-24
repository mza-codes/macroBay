import { Card, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect } from "react";
import { useState } from "react";
import Page from "src/components/Page";
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout";
import ErrorCustom from "../Errors/ErrorCustom";
import { ErrorLogo } from "../Errors/Page404";


export default function ImgSingleView() {
    const [errDisplay, setDisplay] = useState(true)
    const [pic, setPic] = useState(null)



    const displayPic = () => {
        const picture = sessionStorage.getItem('imageSingle')
        console.log(picture);
        if (picture === null) {
            setDisplay(true)
        } else {
            let data = JSON.parse(picture)
            console.log(data);
            setDisplay(false)
            setPic(data)
        }
    }

    useEffect(() => {
        displayPic()
    }, [])

    return (
        <>
            <Page title='Image Details'>
                <LogoOnlyLayout />
                <Container sx={{ pt: 2 }} maxWidth='xl'>
                    <Grid spacing={2} container direction='row' alignItems='center' justifyContent='center'>
                        {errDisplay &&
                            <Grid item gap={3} container direction='column' alignItems='center' justifyContent='center'
                                xs={12} >
                                <ErrorLogo />
                                <Typography variant="overline"> Page Not Found </Typography>
                            </Grid>}
                        {!errDisplay && <>
                            <Grid container
                                direction="column"
                                justifyContent="center"
                                alignItems="center" item xs={12} >
                                <Typography variant="h4" gutterBottom> IMAGE DETAILS </Typography>
                            </Grid>
                        <Grid container
                            direction="column"
                            justifyContent="center"
                            alignItems="center" item xs={12} md={6} >
                            <Typography variant="subtitle2" gutterBottom> Image </Typography>
                            <Card>
                                {pic && <img src={pic.download_url} alt={pic.author} />}
                            </Card>
                            <Typography mt={2} variant="overline" gutterBottom> Dimensions: {pic.width} x {pic.height} </Typography>
                        </Grid>
                        <Grid container
                            direction="column"
                            justifyContent="center"
                            alignContent='center'
                            alignSelf='center'
                            textAlign='start'
                            alignItems="flex-start" item xs={12} md={6} sx={{alignSelf:{xs:'auto'},
                            textAlign:{xs:'center'},alignItems:{xs:'center'}}} >
                            {/* sx={{ alignItems: { xs: 'center', md: 'flex-start' } }} */}
                            <Typography variant="h6" gutterBottom> Author: {pic.author} </Typography>
                            <Typography variant="subtitle1" gutterBottom> Dimensions: {pic.width} x {pic.height} </Typography>
                            <Typography variant="subtitle2" gutterBottom> Picture ID: {pic.id} </Typography>
                            <Typography variant="subtitle2" gutterBottom> Provider: {pic.download_url.slice(8,21)} </Typography>
                            <Typography variant="body1" gutterBottom> Server: {pic.url.slice(8,20)} </Typography>
                            <Typography variant="body2" gutterBottom> Source: <a href={pic.url}> {pic.url}</a> </Typography>
                            
                        </Grid></>}

                    </Grid>
                </Container>
            </Page>
        </>
    )
}