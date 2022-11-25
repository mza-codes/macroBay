import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

export default function ErrorCustom({ ...props }) {
  console.log('lOGGING PROPS FROM CUSTOM ERROR', props);

  return (
    <Box sx={{ textAlign: 'center', alignItems: 'center' }}>
      <Typography color='error' variant="h3" paragraph>
        {props.title}
      </Typography>

      <Typography color='error' gutterBottom >
        {props.message}
      </Typography>

      {!props.unShow &&
        <Box
          component="img"
          src="/static/illustrations/illustration_404_Red.svg"
          sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
        />}
      <Button to="/" color='error' size="large" variant="contained" component={RouterLink}>
        Go to Home
      </Button>
    </Box>
  )
};
