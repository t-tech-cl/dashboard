import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import { Field } from 'react-final-form';

const ApplicantExternalReportSection = ({ form }) => {
  const handleOnChangeDate = (date) => form.change('reportDate', date.valueOf());

  return (
    <Grid container rowGap={2}>
      <Typography variant="h3" width="inherit" textAlign="center" sx={{ pb: 2 }}>
        Reporte de Empresa Externa:
      </Typography>
      <Field
        id="reportDate"
        name="reportDate"
        render={() => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Fecha:</InputLabel>
            <DatePicker onChange={handleOnChangeDate} />
          </Grid>
        )}
      />
      <Field
        id="description"
        name="applicant-position"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Descripción:</InputLabel>
            <TextField {...input} multiline rows={3} />
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
            <TextField {...input} multiline rows={3} />
          </Grid>
        )}
      />
    </Grid>
  );
};

export default ApplicantExternalReportSection;
