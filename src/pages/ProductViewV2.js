import { useContext, useState } from "react";
import { useProductContext } from "src/Contexts/ProductContext";
import { Grid, Container, Typography, Box, Avatar } from '@mui/material';
import Page from '../components/Page';
import { User } from "src/Contexts/UserContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "src/Contexts/firebaseConfig";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorCustom from "./ErrorCustom";

export default function ProductView() {
    const { saleItems } = useProductContext();
    const [product, setProduct] = useState({});
    const [notFound, setNotFound] = useState()
    const [loading, setLoading] = useState(true)
    const params = useParams();
    const proId = params.id;
    const { user } = useContext(User)
    const [seller, setSeller] = useState(null)

    const fetchProduct = async () => {
        const data = saleItems.filter((product) => product.id === proId);
        console.log("filtered", data);
        if (data.length >= 1) {
            setProduct(data[0]);
            setNotFound(false);
            setLoading(false);
            user && await getSeller(data[0]?.userId);
        } else {
            setNotFound(true);
            setLoading(false);
        };
    };

    async function getSeller(sellerId) {
        const q = query(collection(db, 'webusers'), where('id', '==', sellerId));
        getDocs(q).then((result) => {
            result.forEach((doc) => {
                setSeller(doc.data())
            });
        }).catch((err) => {
            console.log(err.message);
            console.log("Error Fetching Seller from Firestore", err);
        });
    };

    useEffect(() => {
        fetchProduct();
    }, []);

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

                                <h4>Listed Under: {product.category}</h4>

                                <h4>Listed on: {product.postDate}</h4>

                                <h4>Listed Price: </h4>
                                <Typography variant='h4'>₹ {product.price}/-</Typography>

                                <h6>*Listed price can be negotiaited with Seller</h6>
                                <Typography variant='subtitle2'>{product.description}</Typography>

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


