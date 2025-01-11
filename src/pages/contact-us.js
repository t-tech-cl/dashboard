// material-ui
import { Container, Grid } from '@mui/material';

// project imports
import ContactForm from 'sections/extra-pages/contact/ContactForm';

// ==============================|| CONTACT US - MAIN ||============================== //

function contactUS() {
  return (
    <Grid container spacing={12} justifyContent="center" alignItems="center" sx={{ mb: 12 }}>
      <Grid item xs={12} sm={10} lg={9}>
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
          <ContactForm />
        </Container>
      </Grid>
    </Grid>
  );
}

export default contactUS;
