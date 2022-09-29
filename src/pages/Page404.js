import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box, IconButton } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from 'src/components/Iconify';

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

export default function Page404() {
  return (
    <Page title="404 Page Not Found">
      <Container>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography>

          <Box
            component="img"
            src="/static/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export function ErrorLogo() {
  return (
    // <Box component="img"
    //   src="/static/illustrations/illustration_404.svg"
    //   sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}/>
    <Box  sx={{ textAlign: 'center', alignItems: 'center' }}>
      <Typography color='error' variant="h3" paragraph>
        Sorry, Error 404 !
      </Typography>

      <Typography color='error' >
        Sorry, we couldn’t find what you’re looking for. Perhaps you’ve mistyped the URL?
      </Typography>

      <Box
        component="img"
        src="/static/illustrations/illustration_404_Red.svg"
        sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
      />

      <IconButton to="/" color='error' size="large" variant="contained" component={RouterLink}>
       <Iconify icon='bx:home' width={24} height={24} />
      </IconButton>
    </Box>
  )
}
