import { useContext } from "react";
import { SingleProduct } from "src/Contexts/ProductContext";

import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card } from '@mui/material';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import styled from "@emotion/styled";
import { Box } from "@mui/system";
// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

export default function ProductView() {
    const theme = useTheme();
    const { singleItem } = useContext(SingleProduct)
    console.log('logging product single page view');
    console.log(singleItem);
    let product = singleItem
    return (
        <Page title={`${product.name} Details`}>
            {/* <Container maxWidth="xl"> */}
            <Grid container spacing={2}>
                <Grid spacing={2} item xs={12} md={6} lg={8} container
                    direction="row"
                    alignItems="center"
                    justifyContent="center">
                    {/* <ProductImgStyle alt={product.name} src={product.url} /> */}
                    <img style={{ maxWidth: '50vw', maxHeight: '70vh' }} src={product.url} alt={product.name} />
                </Grid>

                {/* <Grid item xs container
                    direction="row"
                    alignContent="flex-start"
                    justifyContent=""> */}
                <Grid item xs="auto" md lg sx={{ m: 1, p: 2 }}  >
                    <h3>Product Details:</h3>
                    <div style={{padding:'0.7rem'}}>
                        <h3> {product.name}</h3>
                        <h4>Listed Under: {product.category}</h4>
                        <h4>Listed on: {product.postDate}</h4>
                        <h4>Listed Price: </h4>
                        <h2>₹ {product.price}/-</h2>
                        <h6>*Listed price can be negotiaited with Seller</h6>
                    </div>
                    <h3 style={{paddingTop:'0.7rem'}}>Seller Details:</h3>
                    <div style={{padding:'0.7rem'}}>
                        <h4>Name: Jacob 'n Sons</h4>
                        <h4>Contact Number: 7589654230 </h4>
                        <h4>Location: Kannur,Kerala,India </h4>
                    </div>
                </Grid>
            </Grid>
            {/* </Container> */}
        </Page>
    );
}


