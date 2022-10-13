import { useContext, useState } from "react";
import { SingleProduct } from "src/Contexts/ProductContext";
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, Button, Stack, Box, Avatar } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import styled from "@emotion/styled";
import { User } from "src/Contexts/UserContext";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "src/Contexts/firebaseConfig";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorCustom from "./ErrorCustom";
// ----------------------------------------------------------------------


export default function ProductView() {
    const [product, setProduct] = useState()
    // {
    //     name: 'logname',
    //     postDate: 'logdate',
    //     category: 'logccate',
    //     description: 'loggdesc',
    //     price: 562,

    // }
    const [notFound, setNotFound] = useState()
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const proId = params.id
    console.log('LOGING PRODUCTID', proId);
    const theme = useTheme();
    // const { singleItem } = useContext(SingleProduct)
    const { user } = useContext(User)
    const [seller, setSeller] = useState(null)
    let title;
    const fetchProduct = async () => {

        // const docRef = query(collection(db, 'products').doc(db, proId))
        const docRef = collection(db, 'products')
        const result = await getDoc(doc(db, 'products', proId))
        if (result.exists()) {
            let data = result.data()
            user && await getSeller(data.userId)
            setNotFound(false)
            setLoading(false)
            setProduct(result.data())

            console.log('complete');

        } else {
            setNotFound(true)
            setLoading(false)
        }
        console.log(result.exists());
        console.log(result.data());
    }

    async function getSeller(userId) {
        // const { userId } = product
        console.log('userId', userId);
        const q = query(collection(db, 'webusers'), where('id', '==', userId))
        try {
            getDocs(q).then((result) => {
                result.forEach((doc) => {
                    console.log(doc.data());
                    setSeller(doc.data())
                })
            })
        } catch (error) {
            console.log(error.message);
            console.log(error);
        }
    }
    useEffect(() => {
        fetchProduct()
    }, [])
    // `${product.name} Details`

    return (
        <Page title={product?.name + 'Details'}>
            <Container >
                <Grid container item direction="row" alignItems="center" justifyContent="center" xs='auto'>
                    {!notFound && <> <Grid container item xs={12} alignItems="center" justifyContent="center" >
                        {!loading && <img style={{ maxHeight: '76vh' }} src={product.url} alt={product.name} />}
                    </Grid>

                        <Grid item container xs={12}
                            sx={{ alignItems: { xs: 'flex-start' }, justifyContent: { xs: 'flex-start' } }} >
                            {!loading && <Box flexDirection='column' mt={2} >
                                <Typography variant='h4'>{product.name}</Typography>
                                {/* <h3> {product.name}</h3> */}
                                <h4>Listed Under: {product.category}</h4>
                                {/* <Typography variant='h5'>{product.category}</Typography> */}
                                <h4>Listed on: {product.postDate}</h4>
                                {/* <Typography variant='h5'>{product.postDate}</Typography> */}
                                <h4>Listed Price: </h4>
                                <Typography variant='h4'>₹ {product.price}/-</Typography>
                                {/* <h2>₹ {product.price}/-</h2> */}
                                {/* <Typography variant='h4'>{product.name}</Typography> */}
                                <h6>*Listed price can be negotiaited with Seller</h6>
                                <Typography variant='subtitle2'>{product.description}</Typography>
                                {/* <h5 >Description: {product.description}</h5> */}

                                <div style={{ paddingTop: '0.5rem' }}></div>
                                {user && <><h3 >Seller Details:</h3>
                                    <h4>{seller ? seller.username : 'Unknown'}</h4>
                                    <h4>{seller ? seller.phone : 'Unknown'}</h4>
                                    <h4> {seller ? seller.location : 'Unknown'}</h4>
                                    {seller && seller.avatar && <>
                                        {/* <img className="imageRound" src={seller.avatar} alt="avatar" />  */}
                                        <Avatar src={seller.avatar} alt={seller.name + '_avatar'} /></>}
                                </>}
                                {!user && <h4 style={{ marginTop: '0.6rem' }}>Please <Link to='/login'>Login</Link> to Continue</h4>}
                            </Box>}
                        </Grid>
                    </>}
                    <Grid item container xs={12} md={'auto'} sx={{ alignItems: { xs: 'center' }, justifyContent: { xs: 'center' } }} >
                        {notFound && <ErrorCustom title='404 Not Found'
                            message={<> Product with ID <strong> {proId} </strong> Not Found!` </>} />}
                        {loading && <><div className="loader"></div></>}
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}


