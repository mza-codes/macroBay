import { Divider, Grid, IconButton, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ref } from "firebase/storage";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import { db } from "src/Contexts/firebaseConfig";
import { User } from "src/Contexts/UserContext";
import LogoOnlyLayout from "src/layouts/LogoOnlyLayout";
import EditProductForm from "./EditProductForm";
import ErrorCustom from "./ErrorCustom";
import MyPostsCard from "./MyPostsCard";


export default function MyPosts() {
    const [userProducts, setUserProducts] = useState([])
    const [editProduct, setEditProduct] = useState(null)
    const [load, setLoad] = useState(false)
    const [error, setError] = useState(false)
    const [image, setImage] = useState(null)
    const [image2, setImage2] = useState(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const { user } = useContext(User)
    var empty = ''
    const styles = {
        card: {
            position: 'relative',

        },
        overlay: {
            position: 'absolute',
            bottom: '2px',
            right: '2px',
        },
    }

    const getData = async () => {
        console.log('getData called');
        setLoading(true)
        const docRef = collection(db, 'products')
        const q = query(docRef, where('userId', '==', user.uid))
        const resultSnap = await getDocs(q)
        if (resultSnap.docs.length === 0) {
            setMessage('Current User haven`t listed anything for sale')
            setLoading(false)
            setError(true)
            return false
        }
        const data = resultSnap.docs.map((doc) => {
            return {
                ...doc.data(),
                docId: doc.id
            }
        })
        setUserProducts(data)
        setLoading(false)
        // setMessage('Data Found') // comment after use
    }

    useEffect(() => {
        setLoading(true)
        if (user != null) {
            getData()
        } else {
            setMessage('User not found')
        }

    }, [])

    const modifyProduct = (product) => {
        setLoading(true)
        console.log(product)
        setEditProduct(product)
        setImage2(product.url)
        setTimeout(() => {
            // window.scrollTo(0, document.body.scrollHeight);
            const anchor = document.querySelector('#edit')
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' })
            setLoading(false)
        }, 2500);



    }

    return (
        <Page title='My Products' >
            <LogoOnlyLayout />
            <Container>
                <Grid my={2} container item direction='row' alignItems='center' justifyContent='center' textAlign='center' gap={2} >
                    <Grid item xs={12}  >
                        <Typography variant="h3" gutterBottom> My Products </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {loading && <> <div style={{ marginBottom: '1rem' }} className="loaderCustom"></div>
                            <Typography variant="overline" gutterBottom> Fetching Data ... </Typography> <br /> </>}
                        {error && <> <Typography color='error' variant="overline" gutterBottom> {message} </Typography>
                            <ErrorCustom title='Error Getting data !' message={message} unShow={true} /></>}
                    </Grid>
                    <Grid item container xs={12} spacing={1} >
                        {userProducts.map((product) => {
                            return (
                                <Grid key={product.id} item xs={12} sm={6} md={4} lg={3} >
                                    <div style={styles.card} >
                                        <MyPostsCard key={product.id} product={product} />
                                        <div style={styles.overlay}><IconButton onClick={() => { modifyProduct(product) }} >
                                            {load ? <div className="loaderSmall"></div> : <div className="textBlack">
                                                <Iconify icon='bxs:edit' width={25} height={25} /></div>}
                                        </IconButton>
                                        </div>
                                    </div>
                                </Grid>
                            )
                        })}
                    </Grid>

                    {editProduct && <>
                        <Grid item xs={12} pt={2} >
                            <Divider orientation="horizontal" flexItem />
                            <Typography variant="h3" pt={2} >
                                Edit Post Details
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <EditProductForm value={[setImage, setImage2, editProduct]} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <img className="imageView" src={image2} srcSet={image ? URL.createObjectURL(image) : ''} />
                        </Grid>
                    </>}
                    <Grid id='edit'> </Grid>
                </Grid>
            </Container>
        </Page>
    )

}