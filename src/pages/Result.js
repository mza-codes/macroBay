import { Button, Grid, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Iconify from "src/components/Iconify";
import Page from "src/components/Page";
import { db } from "src/Contexts/firebaseConfig";
import { ProductCartWidget } from "src/sections/@dashboard/products";
import ShopProductCard from "src/sections/@dashboard/products/ProductCard";
import ErrorCustom from "./ErrorCustom";
import { ErrorLogo } from "./Page404";
import ResultCard from "./ResultCard";
import ResultSort from "./ResultSort";
export const SortResult = createContext(null)
export default function Result() {
    // console.log(route);
    const [gotResult, setGotResult] = useState(false)
    const [reload, setReload] = useState(false)
    const [singleResult, setSingleResult] = useState(false)
    const [products, setProducts] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const productsRef = collection(db, 'products')
    let searchResult
    let resultLength
    async function getResult() {
        console.log('data', location.state)
        const { category, params } = location.state
        console.log('logging params ', params);
        if (category === 'a') {
            console.log('category empty');
            const q = query(productsRef, where('name', '==', params))
            const snapshot = await getDocs(q).catch((err) => { console.log(err) })
            // .then((snapshot) => {
            console.log('found SNAPSHOT', snapshot)
            console.log(snapshot.docs.length)
            resultLength = snapshot.docs.length
            if (snapshot.docs.length === 0) {
                setGotResult(false)
            } else if (snapshot.docs.length === 1) {
                setSingleResult(true)
                setGotResult(true)
                searchResult = snapshot.docs.map((product) => {
                    return {
                        ...product.data(),
                        id: product.id
                    }
                })
                console.log('LOGGING SEARCH RESULT', searchResult)
                setProducts(searchResult)
            } else {
                setSingleResult(false)
                setGotResult(true)
                searchResult = snapshot.docs.map((product) => {
                    return {
                        ...product.data(),
                        id: product.id
                    }
                })
                console.log('LOGGING SEARCH RESULT', searchResult)
                setProducts(searchResult)
                // snapshot.forEach((doc) => {
                //     setGotResult(true)
                //     console.log(doc.id, " Data printing=> ", doc.data())
                //     searchResult.push(doc.data(),id:doc.id)
                //     
                // })
            }
            // }).catch((err) => { console.log(err) })
        } else {
            const q = query(productsRef, where('category', '==', category))
            const snapshot = await getDocs(q).catch((err) => { console.log(err) })
            // .then((snapshot) => {
            console.log('found SNAPSHOTCategory', snapshot)
            console.log(snapshot.docs.length)
            resultLength = snapshot.docs.length
            if (snapshot.docs.length === 0) {
                setGotResult(false)
            }
            else if (snapshot.docs.length === 1) {
                setSingleResult(true)
                setGotResult(true)
                searchResult = snapshot.docs.map((product) => {
                    return {
                        ...product.data(),
                        id: product.id
                    }
                })
                console.log('LOGGING SEARCH RESULT', searchResult)
                setProducts(searchResult)

            }
            else {
                setSingleResult(false)
                setGotResult(true)
                searchResult = snapshot.docs.map((product) => {
                    return {
                        ...product.data(),
                        id: product.id
                    }
                })
                setProducts(searchResult)
                console.log('logging resultMAINCATEGORY', searchResult);
                // snapshot.forEach((doc) => {
                //     setGotResult(true)
                //     console.log(doc.id, " Data printing=> ", doc.data())
                //     searchResult.push(doc.data())
                //     console.log('LOGGING SEARCH RESULT CATEGORY', searchResult)
                //     searchResult.map((product)=>{
                //         console.log('logging product',product);
                //     })
                // })
            }
            // }).catch((err) => { console.log(err) })
        }
        // if (products.length != 0) {
        //     sessionStorage.setItem("searchResult", JSON.stringify(searchResult))
        // }

        // console.log('category', category.length);
    }

    useEffect(() => {
        console.log('useEffect CALLED HERE');
        if (location.state) {
            console.log(location.state);
            getResult()
        }
        console.log(reload,'reload Value');
        // reload && SortedResult()
    }, [location.state, reload])
    if (!location.state) {
        return (
            <>
                <ErrorLogo />
            </>
        )
    }
    function SortedResult() {
        console.log('Sorted Result function called here');
        return (
            products.map((product) => {
                return (
                    <Grid key={product.id} item xs={12} sm={6} md={3}>
                        <ResultCard product={product} />
                    </Grid>
                )
            })
        )
    }
    return (
        <div>
            <Page title="Sale">
                <Container>
                    <SortResult.Provider value={{ products, setProducts, reload, setReload }} >
                        {gotResult ? <> <Typography variant="subtitle1">
                            Displaying total of {products.length} results from Database
                        </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                for "{location.state.params}" from "{location.state.category}"
                            </Typography> </> : <> <ErrorCustom title='No Results Found'
                                message={`Uh' There is no matching results for your query
                         "${location.state.params}"`} /> </>}


                        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 1 }}>
                            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
                                {/* <Button variant="filled" color="error" onClick={() => { setReload(false) }} >
                                    <Iconify icon='bx:refresh' width={20} height={20} />
                                </Button> */}
                                 {gotResult && <ResultSort />}
                            </Stack>
                        </Stack>

                        <Grid container spacing={3}>

                            {gotResult &&
                                products.map((product) => {
                                    return (
                                        <Grid key={product.id} item xs={12} sm={6} md={3}>
                                            <ResultCard product={product} />
                                        </Grid>

                                    )
                                })
                            }

                            {/* {reload &&
                                products.map((product) => {
                                    return (
                                        <Grid key={product.id} item xs={12} sm={6} md={3}>
                                            <ResultCard product={product} />
                                            <p>reload</p>
                                        </Grid>)
                                })
                            } */}
                            {/* {singleResult && gotResult &&
                            <Grid item xs={12} sm={6} md={3}>
                                <ResultCard product={products} />
                            </Grid>
                        } */}
                        </Grid>

                        {/* {singleResult && <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <ShopProductCard product={product} />
                                </Grid>
                        </Grid>} */}
                    </SortResult.Provider>
                </Container>
            </Page>

        </div>
    )
    // return (
    //     <Card className='pointer' >
    //       <Box sx={{ pt: '100%', position: 'relative' }} onClick={renderProduct}>
    //         {status && (
    //           <Label
    //             variant="filled"
    //             color={(status === 'sale' && 'info') || 'error'}
    //             sx={{
    //               zIndex: 9,
    //               top: 16,
    //               right: 16,
    //               position: 'absolute',
    //               textTransform: 'uppercase',
    //             }}
    //           >
    //             {status}
    //           </Label>
    //         )}
    //         <ProductImgStyle alt={name} src={url} />
    //       </Box>

    //       <Stack spacing={1} sx={{ p: 3 }}>
    //         <Link to="/viewproduct" color="inherit" underline="hover" component={RouterLink}>
    //           <Typography variant="subtitle2" noWrap>
    //             {name}
    //           </Typography>
    //         </Link>
    //         <Typography variant="subtitle2" noWrap>
    //           {category}
    //         </Typography>
    //         <Stack direction="row" alignItems="center" justifyContent="space-between">
    //           {/* <ColorPreview colors={colors} /> */}
    //           <Typography variant="subtitle1">
    //             {/* <Typography
    //               component="span"
    //               variant="body1"
    //               sx={{
    //                 color: 'text.disabled',
    //                 textDecoration: 'line-through',
    //               }}
    //             >
    //               {price && fCurrency(priceSale)}
    //             </Typography> */}
    //             &nbsp;
    //             {/* {fCurrency(price)} */}
    //             ₹ {price}
    //           </Typography>
    //           <Typography
    //             component="span"
    //             variant="body1"
    //             sx={{
    //               color: 'text.disabled',
    //               textDecoration: 'line-through',
    //             }}
    //           >
    //             {/* {price && fCurrency(priceSale)} */}
    //             {price && `₹ ${priceSale}`}
    //           </Typography>
    //         </Stack>
    //         <span style={{ fontSize: '0.7rem', paddingTop: '0.5rem' }}>{postDate.slice(0, 10)}</span>
    //         {/* <span style={{fontSize:'0.7rem',paddingTop:'0.5rem'}}>{postDate}</span> */}
    //         {admin && <Button onClick={() => {
    //           if (window.confirm('Delete the item?')) {
    //             deleteProduct(id, url)
    //           }
    //         }} variant='outlined' color='error' >
    //           <Iconify width={24} height={24} icon='ic:round-delete-forever' /> </Button>}
    //       </Stack>

    //     </Card>
    //   );
}