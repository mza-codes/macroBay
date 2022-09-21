import { useContext, useState } from "react";
import { SingleProduct } from "src/Contexts/ProductContext";
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, Button, Stack } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import styled from "@emotion/styled";
import { User } from "src/Contexts/UserContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "src/Contexts/firebaseConfig";
import { useEffect } from "react";
import { Link } from "react-router-dom";
// ----------------------------------------------------------------------


export default function ProductView() {
    const theme = useTheme();
    const { singleItem } = useContext(SingleProduct)
    const { user } = useContext(User)
    const [seller, setSeller] = useState(null)

    function getSeller() {
        const { userId } = singleItem
        const q = query(collection(db, 'webusers'), where('id', '==', userId))
        try {
            getDocs(q).then((result) => {
                result.forEach((doc) => {
                    setSeller(doc.data())
                })
            })
            // querySnapshot = await getDocs(q);
        } catch (error) {
            console.log(error.message);
            console.log(error);
        }
    }
    useEffect(() => {
        if (user != null) {
            getSeller()
        }
    }, [])
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
                    <img style={{ maxWidth: '45vw', maxHeight: '70vh' }} src={product.url} alt={product.name} />
                </Grid>

                {/* <Grid item xs container
                    direction="row"
                    alignContent="flex-start"
                    justifyContent=""> */}
                <Grid item xs="auto" md lg sx={{ m: 1, p: 2 }}  >
                    <h3>Product Details:</h3>
                    <div style={{ padding: '0.7rem' }}>
                        <h3> {product.name}</h3>
                        <h4>Listed Under: {product.category}</h4>
                        <h4>Listed on: {product.postDate}</h4>
                        <h4>Listed Price: </h4>
                        <h2>₹ {product.price}/-</h2>
                        <h6>*Listed price can be negotiaited with Seller</h6>
                    </div>
                    <h3 style={{ paddingTop: '0.7rem' }}>Seller Details:</h3>
                    <div>{user ? <div style={{ padding: '0.7rem' }}>
                        <h4>{seller ? seller.username : 'Unknown'}</h4>
                        <h4>{seller ? seller.phone : 'Unknown'}</h4>
                        <h4>Location: Kannur,Kerala,India </h4>
                    </div> :
                        <div style={{ margin: '0.6rem' }}>
                            <h4 style={{ marginTop: '0.6rem' }}>Please <Link to='/login'>Login</Link> to Continue</h4>
                            {/* <Button variant="contained" >Login</Button>  */}
                        </div>}
                    </div>
                </Grid>
            </Grid>
            {/* </Container> */}
        </Page>
    );
}


