import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Link, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';
import Logo from '../components/Logo';
// sections
import { default as ProductForm } from './CreatePostFormSimple';
import { createContext, useState } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
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

// ----------------------------------------------------------------------
export const ImgView = createContext(null)
export default function CreatePost() {
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');
  const [image,setImage] = useState(null)
  const [image2,setImage2] = useState(null)

  return (
    <Page title="Sell">
      <RootStyle>
        {/* <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Already have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/login">
                Login
              </Link>
            </Typography>
          )}
        </HeaderStyle> */}
        {/* {mdUp && ( */}
        {/* <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Manage the job more effectively with Minimal
            </Typography>
            <img alt="register" src="/static/illustrations/illustration_register.png" />
          </SectionStyle> */}
        {/* )} */}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Enter Product Details
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Let's make some bucks !</Typography>
            <ImgView.Provider value={{image,setImage,image2,setImage2}}>
            <ProductForm />
            </ImgView.Provider >
            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              By Posting this for Sale, I agree to MacroBay&nbsp;
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
        {/* <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Manage the job more effectively with Minimal
          </Typography>
          <img alt="register" src="/static/illustrations/illustration_register.png" />
        </SectionStyle> */}
        <Container>
          {/* <ContentStyle> */}
          {/* <SectionStyle> */}
            {/* <Typography variant="h4" gutterBottom>
              Enter Product Details
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>Let's make some bucks !</Typography>

            <ProductForm />

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              By Posting this for Sale, I agree to MacroBay&nbsp;
              <Link underline="always" color="text.primary" href="#">
                Terms of Service
              </Link>
              {''} and {''}
              <Link underline="always" color="text.primary" href="#">
                Privacy Policy
              </Link>
              .
            </Typography> */}
            <div >
            <img style={{marginTop:'0.3rem'}} src={image ? URL.createObjectURL(image) : ''}  />
            <img style={{marginTop:'0.3rem'}} src={image2 ? URL.createObjectURL(image2) : ''}  />
            </div>
            {/* <img src="https://firebasestorage.googleapis.com/v0/b/microbay-mza.appspot.com/o/productImages%2FKM%20300%20BXCgfgf-min.jpg?alt=media&token=4f21ed0f-cc3e-42c8-ac36-3c8202c3a265" alt="" /> */}
          {/* </ContentStyle> */}
          {/* </SectionStyle> */}
        </Container>
      </RootStyle>
    </Page>
  );
}
