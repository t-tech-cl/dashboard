import { Grid } from '@mui/material';
import Card from 'components/card';
import SearchDocumentForm from 'components/forms/search-document';

const SearchDocumentComponent = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" marginTop={10}>
      <Card maxWidth={{ xs: 450, lg: 600 }}>
        <SearchDocumentForm />
      </Card>
    </Grid>
  );
};

export default SearchDocumentComponent;
