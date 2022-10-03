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
            <Container >
                <Grid container item direction="row" alignItems="center" justifyContent="center" xs='auto'>
                    <Grid container item xs={12} md={6} alignItems="center" justifyContent="center" >
                        <img style={{ maxHeight: '76vh' }} src={product.url} alt={product.name} />
                    </Grid>

                    <Grid item container xs={12} md={6}
                        sx={{ alignItems: { xs: 'flex-start' }, justifyContent: { xs: 'flex-start' } }} >
                        <div style={{ marginLeft: '0.8rem' }}>
                            <h3> {product.name}</h3>
                            <h4>Listed Under: {product.category}</h4>
                            <h4>Listed on: {product.postDate}</h4>
                            <h4>Listed Price: </h4>
                            <h2>₹ {product.price}/-</h2>
                            <h6>*Listed price can be negotiaited with Seller</h6>
                            <h5 >Description: {product.description}</h5>
                            <div style={{ paddingTop: '0.5rem' }}></div>
                            {user && <><h3 >Seller Details:</h3>
                                <h4>{seller ? seller.username : 'Unknown'}</h4>
                                <h4>{seller ? seller.phone : 'Unknown'}</h4>
                                <h4>Location: Kannur,Kerala,India </h4>
                                {seller && seller.avatar && <> <h4>Seller Avatar: </h4>
                                    <img className="imageRound" src={seller.avatar} alt="avatar" /></>}
                            </>}
                            {!user && <h4 style={{ marginTop: '0.6rem' }}>Please <Link to='/login'>Login</Link> to Continue</h4>}
                        </div>
                        {/* {user ? <div style={{ padding: '0.7rem' }}>
                            <h3 >Seller Details:</h3>
                            <h4>{seller ? seller.username : 'Unknown'}</h4>
                            <h4>{seller ? seller.phone : 'Unknown'}</h4>
                            <h4>Location: Kannur,Kerala,India </h4>
                            <h4>Seller Avatar: </h4>
                            {seller && seller.avatar && <img className="imageRound" src={seller.avatar} alt="avatar" />}
                        </div> :
                            <div>
                                <h3 >Seller Details:</h3>
                                <h4 style={{ marginTop: '0.6rem' }}>Please <Link to='/login'>Login</Link> to Continue</h4>
                            </div>
                        } */}
                    </Grid>
                    <Grid item container xs={12} md={'auto'} sx={{ alignItems: { xs: 'center' }, justifyContent: { xs: 'center' } }} >

                    </Grid>


                </Grid>
            </Container>
        </Page>
    );
}


