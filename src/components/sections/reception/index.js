import { FormControl, FormControlLabel, Grid, InputLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import moment from 'moment';
import React, { memo, useEffect } from 'react';
import { Field } from 'react-final-form';

const ApplicantRequestReceptionSection = memo(({ form, initialValues }) => {
  const { receptionDate, isClean, cleaningObservations } = initialValues;

  const unformattedReceptionDate = moment(receptionDate, 'YYYY-MM-DD');

  const handleOnChangeDate = (date) => form.change('receptionDate', date.valueOf());

  useEffect(() => {
    form.change('receptionDate', unformattedReceptionDate.valueOf());
  }, [form, unformattedReceptionDate]);

  return (
    <Grid container rowGap={2}>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Typography variant="h3" width="inherit" textAlign="center" gutterBottom>
          Datos de Identificación de Recepción:
        </Typography>
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="receptionDate"
          name="receptionDate"
          render={() => (
            <DatePicker label="Fecha:" onChange={handleOnChangeDate} defaultValue={unformattedReceptionDate} sx={{ width: '100%' }} />
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
          id="isClean"
          name="isClean"
          defaultValue="si"
          render={({ input }) => (
            <Grid container flexDirection="row" alignItems="center" columnGap={1}>
              <InputLabel>Limpieza y Orden:</InputLabel>
              <FormControl component="fieldset">
                <RadioGroup {...input} defaultValue={isClean ? 'si' : 'no'}>
                  <Grid flexDirection="column" columnGap={2}>
                    <FormControlLabel value="si" control={<Radio />} label="Si" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </Grid>
                </RadioGroup>
              </FormControl>
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
          id="cleaningObservations"
          name="cleaningObservations"
          defaultValue={cleaningObservations}
          render={({ input }) => (
            <Grid container flexDirection="column" rowGap={1}>
              <InputLabel>Descripción:</InputLabel>
              <TextField {...input} multiline rows={5} />
            </Grid>
          )}
        />
      </motion.div>
    </Grid>
  );
});

export default ApplicantRequestReceptionSection;
