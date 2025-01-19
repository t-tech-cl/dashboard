import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import { Field } from 'react-final-form';

const ApplicantEvaluationSection = () => {
  return (
    <Grid container rowGap={2}>
      <Typography variant="h3" textAlign="center" sx={{ pb: 2 }}>
        Datos de Evaluación de Jefe de Mantenimiento:
      </Typography>
      <Field
        id="assignedTo"
        name="assignedTo"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Deriva a:</InputLabel>
            <TextField {...input} variant="outlined" />
          </Grid>
        )}
      />
      <Field
        id="reason"
        name="reason"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Motivo:</InputLabel>
            <TextField {...input} />
          </Grid>
        )}
      />
      <Field
        id="managerObservations"
        name="managerObservations"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Observaciones:</InputLabel>
            <TextField {...input} multiline rows={5} />
          </Grid>
        )}
      />
    </Grid>
  );
};

export default ApplicantEvaluationSection;
