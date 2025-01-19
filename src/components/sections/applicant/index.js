import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import { Field } from 'react-final-form';

const ApplicantSection = ({ requestNumber }) => {
  return (
    <Grid container rowGap={2}>
      <Typography variant="h3" textAlign="center" sx={{ pb: 2 }}>
        Ingresa numero de Solicitud y datos del solicitante:
      </Typography>
      <Field
        id="requestNumber"
        name="requestNumber"
        defaultValue={requestNumber}
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>N° de Solicitud:</InputLabel>
            <TextField
              {...input}
              variant="outlined"
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#ffffff70'
                }
              }}
            />
          </Grid>
        )}
      />
      <Field
        id="name"
        name="name"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Nombre:</InputLabel>
            <TextField {...input} />
          </Grid>
        )}
      />
      <Field
        id="role"
        name="role"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Cargo:</InputLabel>
            <TextField {...input} />
          </Grid>
        )}
      />
      <Field
        id="area"
        name="area"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Área:</InputLabel>
            <TextField {...input} />
          </Grid>
        )}
      />
      <Field
        id="signature"
        name="signature"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Firma:</InputLabel>
            <TextField {...input} />
          </Grid>
        )}
      />
    </Grid>
  );
};

export default ApplicantSection;
