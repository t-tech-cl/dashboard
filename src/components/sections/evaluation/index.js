import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Field } from 'react-final-form';

const ApplicantEvaluationSection = memo(({ initialValues }) => {
  const { assignedTo, reason, managerObservations } = initialValues;

  return (
    <Grid container rowGap={2}>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Typography variant="h3" textAlign="center" gutterBottom>
          Datos de Evaluación de Jefe de Mantenimiento:
        </Typography>
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="assignedTo"
          name="assignedTo"
          defaultValue={assignedTo}
          render={({ input }) => <TextField {...input} variant="outlined" label="Deriva a:" fullWidth />}
        />
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field id="reason" name="reason" defaultValue={reason} render={({ input }) => <TextField {...input} label="Motivo:" fullWidth />} />
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="managerObservations"
          name="managerObservations"
          defaultValue={managerObservations}
          render={({ input }) => (
            <Grid container flexDirection="column" rowGap={1}>
              <InputLabel>Observaciones:</InputLabel>
              <TextField {...input} multiline rows={5} />
            </Grid>
          )}
        />
      </motion.div>
    </Grid>
  );
});

export default ApplicantEvaluationSection;
