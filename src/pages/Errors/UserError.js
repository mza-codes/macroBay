import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
// components
import { signOut } from 'firebase/auth';
import { auth } from 'src/Contexts/firebaseConfig';
import Page from 'src/components/Page';

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

export default function UserError() {
  const handleLogout = ()=>{
    try {
      signOut(auth).then(()=>{console.log('logout complete')}).catch((err)=>{console.log(err);})
    } catch (error) {
      alert('task failed')
      console.log(error);
    } 
  }
  return (
    <Page title="User Exists">
      <Container>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography style={{color:'#4c1130'}} variant="h3" paragraph>
            Uh Uh, It Looks like Someone's already Logged In !
          </Typography>

          <Typography style={{color:'#85200c'}}>
            Sorry, we couldn’t display the page you’re looking for. This likely happens when there is another user logged in the current session. Try Logging out 
            your current session or consider another session.
          </Typography>

          <Box
            component="img"
            src="/static/illustrations/illustration_register.png"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Go to Home
          </Button>
          <Button onClick={handleLogout} sx={{m:1}} color='error' size="" variant="contained">
            LogOut
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
