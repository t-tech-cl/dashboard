import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import { Field } from 'react-final-form';

const ApplicantEvaluationSection = () => {
  return (
    <Grid container rowGap={2}>
      <Typography variant="h3" textAlign="center" gutterBottom>
        Datos de Evaluación de Jefe de Mantenimiento:
      </Typography>
      <Field
        id="assignedTo"
        name="assignedTo"
        render={({ input }) => <TextField {...input} variant="outlined" label="Deriva a:" fullWidth />}
      />
      <Field id="reason" name="reason" render={({ input }) => <TextField {...input} label="Motivo:" fullWidth />} />
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
