import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import { Field, Form } from 'react-final-form';

const ApplicantExternalCompanyReport = () => {
  const handleSubmit = () => console.log;

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} id="xx">
          <Grid container rowGap={2}>
            <Typography variant="h3" width="inherit" textAlign="center">
              Reporte de Empresa Externa:
            </Typography>
            <Field
              id="reportDate"
              name="reportDate"
              render={() => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Fecha:</InputLabel>
                  <DatePicker />
                </Grid>
              )}
            />
            <Field
              id="applicant-position"
              name="applicant-position"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Descripción:</InputLabel>
                  <TextField {...input} multiline rows={5} />
                </Grid>
              )}
            />
            <Field
              id="requestNumber"
              name="requestNumber"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Deriva a:</InputLabel>
                  <TextField {...input} variant="outlined" />
                </Grid>
              )}
            />
            <Field
              id="applicantName"
              name="applicantName"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Motivo:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field
              id="applicant-position"
              name="applicant-position"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Observaciones:</InputLabel>
                  <TextField {...input} multiline rows={5} />
                </Grid>
              )}
            />
          </Grid>
        </form>
      )}
    />
  );
};

export default ApplicantExternalCompanyReport;
