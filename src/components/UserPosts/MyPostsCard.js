import PropTypes from 'prop-types';
import { Box, Card, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

MyPostsCard.propTypes = {
    product: PropTypes.object,
};

export default function MyPostsCard({ product }) {
    const { name, category, postDate, price, url, id } = product;
    const renderProduct = () => {
        console.log("nothing to do ");
    };

    return (
        <Card className='pointer' >
            <Box sx={{ pt: '100%', position: 'relative' }} onClick={renderProduct}>
                <ProductImgStyle alt={name} src={url} />
            </Box>

            <Stack spacing={1} sx={{ p: 3 }}>
                <Typography onClick={renderProduct} variant="subtitle2" noWrap>
                    {name}
                </Typography>
                <Typography variant="subtitle2" noWrap>
                    {category}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    {/* <ColorPreview colors={colors} /> */}
                    <Typography variant="subtitle1">
                        &nbsp;
                        ₹ {price}
                    </Typography>

                </Stack>
                <span style={{ fontSize: '0.7rem' }}>{postDate.slice(0, 10)}</span>
            </Stack>

        </Card>
    );
}
