import { Grid, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import _ from "lodash";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "src/components/Page";
import ErrorCustom from "./ErrorCustom";
import { ErrorLogo } from "./Page404";
import ResultCard from "./ResultCard";
import ResultSort from "./ResultSort";

export const SortResult = createContext(null)

export default function Result() {

    const [gotResult, setGotResult] = useState(false)
    const [reload, setReload] = useState(false)
    const [products, setProducts] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const fetchResult = async (params) => {
        console.log('fetchResult called here')
        const products = JSON.parse(sessionStorage.getItem('localProducts'))
        console.log('fetched products from session', products);
        const result = products.filter(
            product => {
                return (
                    product
                        .name
                        .toLowerCase()
                        .includes(params.toLowerCase()) ||
                    product
                        .description
                        .toLowerCase()
                        .includes(params.toLowerCase())
                );
            }
        );
        console.log('fetchRES', result);
        setGotResult(true)
        setProducts(result)
        result.length === 0 && setGotResult(false)
    }

    const fetchResultByCategory = (category) => {
        console.log('fetchResultByCategory()')
        const products = JSON.parse(sessionStorage.getItem('localProducts'))
        console.log('fetched products from session', products);
        const result = products.filter(
            product => {
                return (
                    product
                        .category
                        .toLowerCase()
                        .includes(category.toLowerCase())
                );
            }
        );
        console.log('fetchRES', result);
        setGotResult(true)
        setProducts(result)
        result.length === 0 && setGotResult(false)
    }

    function fetchResultByPrice(params) {
        console.log('fetchResultByPrice()');
        const products = JSON.parse(sessionStorage.getItem('localProducts'))
        console.log('fetched products from session', products);
        let result = products.filter(
            product => {
                return (
                    parseInt(product.price) < parseInt(params)
                );
            }
        );
        console.log('fetchRES', result);
        result = _.sortBy(result, 'price').reverse()
        setGotResult(true)
        setProducts(result)
        result.length === 0 && setGotResult(false)
    }

    function fetchResultv2(category, params) {
        console.log('fetchResultv2(category,params)');
        console.log(category, params)
        const products = JSON.parse(sessionStorage.getItem('localProducts'))
        console.log('fetched products from session', products);
        let result = products.filter(
            product => {
                return (
                    product
                        .category
                        .toLowerCase()
                        .includes(category.toLowerCase())
                );
            }
        );
        console.log('fetchRES', result);
        if (result.length == 0) {
            setGotResult(false)
            return false
        }
        let data = result.filter(
            product => {
                return (
                    parseInt(product.price) < parseInt(params)
                );
            }
        );
        console.log('fetchRES', data);
        data = _.sortBy(data, 'price').reverse()
        setGotResult(true)
        setProducts(data)
        data.length === 0 && setGotResult(false)
    }

    useEffect(() => {
        console.log('useEffect CALLED HERE');

        if (location.state) {
            const { category, params } = location.state
            let isnum = /^\d+$/.test(params);
            console.log('ISNUM', isnum);
            if (isnum && category != 'a') {
                console.log('category selected and price entered');
                fetchResultv2(category, params)
                return
            } else if (isnum && category === 'a') {
                console.log('number only found');
                location.state.category = 'All Categories'
                fetchResultByPrice(params)
                return
            } else if (category === 'a') {
                location.state.category = 'All Categories'
                fetchResult(params)
                return
            } else {
                fetchResultByCategory(category)
                return
            }
        }
    }, [location.state])
    
    if (!location.state) { return (<> <ErrorLogo /> </>) }

    return (
        <div>
            <Page title="Sale">
                <Container>
                    <SortResult.Provider value={{ products, setProducts, reload, setReload }} >
                        {gotResult ? <> <Typography variant="subtitle1">
                            Displaying total of {products.length} results
                        </Typography>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                {location.state.params ? `for "${location.state.params}"` : ''} from "{location.state.category}"
                            </Typography> </> : <> <ErrorCustom title='No Results Found'
                                message={`Uh' There is no matching results for your query
                         "${location.state.params ? location.state.params : location.state.category}"`} /> </>}

                        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 1 }}>
                            <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
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
                        </Grid>

                    </SortResult.Provider>
                </Container>
            </Page>

        </div>
    )
}