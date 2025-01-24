import { FormControl, FormControlLabel, Grid, InputLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import React from 'react';
import { Field } from 'react-final-form';

const ApplicantRequestReceptionSection = ({ form }) => {
  const handleOnChangeDate = (date) => form.change('receptionDate', date.valueOf());

  return (
    <Grid container rowGap={2}>
      <Typography variant="h3" width="inherit" textAlign="center" sx={{ pb: 2 }}>
        Datos de Identificación de Recepción:
      </Typography>
      <Field
        id="receptionDate"
        name="receptionDate"
        render={() => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Fecha:</InputLabel>
            <DatePicker onChange={handleOnChangeDate} />
          </Grid>
        )}
      />
      <Field
        id="isClean"
        name="isClean"
        render={({ input }) => (
          <Grid container flexDirection="row" alignItems="center" columnGap={1}>
            <InputLabel>Limpieza y Orden:</InputLabel>
            <FormControl component="fieldset">
              <RadioGroup {...input} name="radio-buttons-group" row defaultValue="si">
                <Grid flexDirection="column" columnGap={2}>
                  <FormControlLabel value="si" control={<Radio checked />} label="Si" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
      />
      <Field
        id="cleaningObservations"
        name="cleaningObservations"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Descripción:</InputLabel>
            <TextField {...input} multiline rows={5} />
          </Grid>
        )}
      />
    </Grid>
  );
};

export default ApplicantRequestReceptionSection;
