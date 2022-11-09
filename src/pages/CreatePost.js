import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';
import Page from '../components/Page';
import { default as ProductForm } from './CreatePostFormSimple';
import { useState } from 'react';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '70vh',
  display: 'flex',
  // justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(5, 0),
}));

export default function CreatePost() {
  const [image,setImage] = useState(null);
  const [image2,setImage2] = useState(null);

  return (
    <Page title="Sell">
      <RootStyle>
        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Enter Product Details
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 2 }}>Let's make some bucks !</Typography>
            
            <ProductForm value={[setImage,setImage2]} />
            
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              By Posting this item for Sale, I agree to MacroBay&nbsp;
              <Link underline="always" color="text.primary" href="#">
                Terms of Service
              </Link>
              {''} and {''}
              <Link underline="always" color="text.primary" href="#">
                Privacy Policy
              </Link>
              .
            </Typography>
          </ContentStyle>
        </Container>
        <Container>
            {image && <div > <h6>{image.name}</h6>
            <img style={{marginTop:'0.3rem'}} src={image ? URL.createObjectURL(image) : ''} alt="_product_image" />
            {image2 && <img style={{marginTop:'0.3rem'}} src={image2 ? URL.createObjectURL(image2) : ''} alt="_product_image"  />}
            </div>}
        </Container>
      </RootStyle>
    </Page>
  );
}
