import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import { Field } from 'react-final-form';

const ApplicantExternalReportSection = ({ form }) => {
  const handleOnChangeDate = (date) => form.change('reportDate', date.valueOf());

  return (
    <Grid container rowGap={2}>
      <Typography variant="h3" width="inherit" textAlign="center" gutterBottom>
        Reporte de Empresa Externa:
      </Typography>
      <Field
        id="reportDate"
        name="reportDate"
        render={() => <DatePicker onChange={handleOnChangeDate} label="Fecha:" sx={{ width: '100%' }} />}
      />
      <Field
        id="reportDescription"
        name="reportDescription"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Descripción:</InputLabel>
            <TextField {...input} multiline rows={3} />
          </Grid>
        )}
      />
      <Field
        id="reportAssignedTo"
        name="reportAssignedTo"
        render={({ input }) => <TextField {...input} variant="outlined" label="Deriva a:" fullWidth />}
      />
      <Field id="reportReason" name="reportReason" render={({ input }) => <TextField {...input} label="Motivo:" fullWidth />} />
      <Field
        id="reportObservations"
        name="reportObservations"
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
