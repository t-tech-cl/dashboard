import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import { Field, Form } from 'react-final-form';
// import { updateRequest } from 'store/reducers/maintenanceRequest'

const ApplicantForm = ({ onSubmit, onNext }) => {
  const handleOnSubmit = async (form) => {
    onSubmit?.();
    console.log(form);
  };

  return (
    <Form
      onSubmit={handleOnSubmit}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit} id="xx">
          <Grid container rowGap={2}>
            <Typography variant="h3" textAlign="center">
              Ingresa numero de Solicitud y datos del solicitante:
            </Typography>
            <Field
              id="requestNumber"
              name="requestNumber"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>N° de Solicitud:</InputLabel>
                  <TextField {...input} variant="outlined" />
                </Grid>
              )}
            />
            <Field
              id="applicantName"
              name="applicantName"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Nombre:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field
              id="applicantRole"
              name="applicantRole"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Cargo:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field
              id="applicantArea"
              name="applicantArea"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Área:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field
              id="applicantSignature"
              name="applicantSignature"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Firma:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            {/* Pass the form object to the parent */}
            {onNext && onNext(values)}
          </Grid>
        </form>
      )}
    />
  );
};

export default ApplicantForm;
