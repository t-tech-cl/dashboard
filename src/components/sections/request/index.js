import { FormControlLabel, Grid, InputLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import React from 'react';
import { Field } from 'react-final-form';

const ApplicantRequestSection = ({ form }) => {
  const handleOnChangeDate = (date) => form.change('requestDate', date.valueOf());

  return (
    <Grid container rowGap={2}>
      <Typography variant="h3" alignSelf="center" width="inherit" textAlign="center" sx={{ pb: 2 }}>
        Ingresa datos de Solicitud:
      </Typography>
      <Field
        id="requestDate"
        name="requestDate"
        render={() => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Fecha Solicitud:</InputLabel>
            <DatePicker onChange={handleOnChangeDate} />
          </Grid>
        )}
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
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Equipo / Área:</InputLabel>
            <TextField {...input} variant="outlined" />
          </Grid>
        )}
      />
      <Field
        id="brand"
        name="brand"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Marca:</InputLabel>
            <TextField {...input} />
          </Grid>
        )}
      />
      <Field
        id="location"
        name="location"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Ubicación:</InputLabel>
            <TextField {...input} />
          </Grid>
        )}
      />
      <Field
        id="serialNumber"
        name="serialNumber"
        render={({ input }) => (
          <Grid container flexDirection="column" rowGap={1}>
            <InputLabel>Número:</InputLabel>
            <TextField {...input} />
          </Grid>
        )}
      />
    </Grid>
  );
};

export default ApplicantRequestSection;
