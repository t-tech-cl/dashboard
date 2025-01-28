import { Grid, InputLabel, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import moment from 'moment';
import React, { memo, useEffect } from 'react';
import { Field } from 'react-final-form';

const ApplicantExternalReportSection = memo(({ form, initialValues }) => {
  const { externalReport: { reportDate, description, assignedTo, reason, observations } = {} } = initialValues;

  const unformattedReportDate = moment(reportDate, 'YYYY-MM-DD');
  const handleOnChangeDate = (date) => form.change('reportDate', date.valueOf());

  useEffect(() => {
    form.change('reportDate', unformattedReportDate.valueOf());
  }, [form, unformattedReportDate]);

  return (
    <Grid container rowGap={2}>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Typography variant="h3" width="inherit" textAlign="center" gutterBottom>
          Reporte de Empresa Externa:
        </Typography>
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="reportDate"
          name="reportDate"
          render={() => (
            <DatePicker onChange={handleOnChangeDate} label="Fecha:" defaultValue={unformattedReportDate} sx={{ width: '100%' }} />
          )}
        />
      </motion.div>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="reportDescription"
          name="reportDescription"
          defaultValue={description}
          render={({ input }) => (
            <Grid container flexDirection="column" rowGap={1}>
              <InputLabel>Descripción:</InputLabel>
              <TextField {...input} multiline rows={3} />
            </Grid>
          )}
        />
      </motion.div>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="reportAssignedTo"
          name="reportAssignedTo"
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
        <Field
          id="reportReason"
          name="reportReason"
          defaultValue={reason}
          render={({ input }) => <TextField {...input} label="Motivo:" fullWidth />}
        />
      </motion.div>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="reportObservations"
          name="reportObservations"
          defaultValue={observations}
          render={({ input }) => (
            <Grid container flexDirection="column" rowGap={1}>
              <InputLabel>Observaciones:</InputLabel>
              <TextField {...input} multiline rows={3} />
            </Grid>
          )}
        />
      </motion.div>
    </Grid>
  );
});

export default ApplicantExternalReportSection;
