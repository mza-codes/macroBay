import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, LinearProgress, CircularProgress } from '@mui/material';
// components
import Page from '../components/Page';
import { useState } from 'react';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ErrorCustom({ ...props }) {
  console.log('lOGGING PROPS FROM CUSTOM ERROR', props);
  const [load,stopLoad] = useState(true)
  setTimeout(() => {
    stopLoad(false)
  }, 1500); 
  return (
    // <Box component="img"
    //   src="/static/illustrations/illustration_404.svg"
    //   sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}/>
    <Box sx={{ textAlign: 'center', alignItems: 'center' }}>
      <Typography color='error' variant="h3" paragraph>
        {props.title}
      </Typography>

      <Typography color='error' gutterBottom >
        {props.message}
      </Typography>

      {!props.unShow && <Box
        component="img"
        src="/static/illustrations/illustration_404_Red.svg"
        sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
      />}
      <Button to="/" color='error' size="large" variant="contained" component={RouterLink}>
        Go to Home
      </Button>
    </Box>
  )
}
