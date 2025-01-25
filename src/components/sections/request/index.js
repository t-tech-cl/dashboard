import { FormControlLabel, Grid, InputLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import React from 'react';
import { Field } from 'react-final-form';

const ApplicantRequestSection = ({ form }) => {
  const handleOnChangeDate = (date) => form.change('requestDate', date.valueOf());

  return (
    <Grid container rowGap={2}>
      <Typography variant="h3" alignSelf="center" width="inherit" textAlign="center" gutterBottom>
        Ingresa datos de Solicitud:
      </Typography>
      <Field
        id="requestDate"
        name="requestDate"
        render={() => <DatePicker label="Fecha Solicitud:" onChange={handleOnChangeDate} sx={{ width: '100%' }} />}
      />
      <Field
        id="requestType"
        name="requestType"
        type="radio"
        defaultValue="preventiva"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Tipo de Solicitud:</InputLabel>
            <RadioGroup {...input}>
              <Grid flexDirection="column" columnGap={2}>
                <FormControlLabel value="preventiva" control={<Radio checked />} label="Preventiva" />
                <FormControlLabel value="correctiva" control={<Radio />} label="Correctiva" />
                <FormControlLabel value="instalaciones" control={<Radio />} label="Instalaciones" />
              </Grid>
            </RadioGroup>
          </Grid>
        )}
      />
      <Field
        id="equipmentArea"
        name="equipmentArea"
        render={({ input }) => <TextField {...input} fullWidth label="Equipo / Área:" variant="outlined" />}
      />
      <Field id="brand" name="brand" render={({ input }) => <TextField {...input} fullWidth label="Marca:" />} />
      <Field id="location" name="location" render={({ input }) => <TextField {...input} fullWidth label="Ubicación:" />} />
      <Field id="serialNumber" name="serialNumber" render={({ input }) => <TextField {...input} fullWidth label="Número:" />} />
    </Grid>
  );
};

export default ApplicantRequestSection;
