import { FormControlLabel, Grid, InputLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import moment from 'moment';
import React, { memo } from 'react';
import { Field } from 'react-final-form';

const ApplicantRequestSection = memo(({ initialValues }) => {
  const { requestDate, requestType, equipmentArea, brand, location, serialNumber } = initialValues;

  // Format the initial date value once
  const initialDateValue = requestDate ? moment(requestDate, 'YYYY-MM-DD').valueOf() : null;

  return (
    <Grid container rowGap={2}>
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Typography variant="h3" alignSelf="center" width="inherit" textAlign="center" gutterBottom>
          Ingresa datos de Solicitud:
        </Typography>
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="requestDate"
          name="requestDate"
          initialValue={initialDateValue}
          render={({ input }) => (
            <DatePicker
              value={input.value ? moment(input.value) : moment()}
              onChange={(date) => input.onChange(date.valueOf())}
              label="Fecha Solicitud:"
              sx={{ width: '100%' }}
            />
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
          id="requestType"
          name="requestType"
          type="radio"
          defaultValue="Preventiva"
          render={({ input }) => (
            <Grid container flexDirection="column" rowGap={1}>
              <InputLabel>Tipo de Solicitud:</InputLabel>
              <RadioGroup {...input} defaultValue={requestType}>
                <Grid flexDirection="column" columnGap={2}>
                  <FormControlLabel value="Preventiva" control={<Radio />} label="Preventiva" />
                  <FormControlLabel value="Correctiva" control={<Radio />} label="Correctiva" />
                  <FormControlLabel value="Instalaciones" control={<Radio />} label="Instalaciones" />
                </Grid>
              </RadioGroup>
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
          id="equipmentArea"
          name="equipmentArea"
          defaultValue={equipmentArea}
          render={({ input }) => <TextField {...input} fullWidth label="Equipo / Área:" variant="outlined" />}
        />
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field id="brand" name="brand" defaultValue={brand} render={({ input }) => <TextField {...input} fullWidth label="Marca:" />} />
      </motion.div>

      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="location"
          name="location"
          defaultValue={location}
          render={({ input }) => <TextField {...input} fullWidth label="Ubicación:" />}
        />
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Field
          id="serialNumber"
          name="serialNumber"
          defaultValue={serialNumber}
          render={({ input }) => <TextField {...input} fullWidth label="Número:" />}
        />
      </motion.div>
    </Grid>
  );
});

export default ApplicantRequestSection;
