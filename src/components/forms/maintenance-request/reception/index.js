import { FormControl, FormControlLabel, Grid, InputLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import React from 'react'
import { Field, Form } from 'react-final-form'

const ApplicantRequestReception = () => {
  const handleSubmit = () => console.log

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} id='xx'>
          <Grid container rowGap={2}>
            <Typography variant='h3' width="inherit" textAlign="center">Datos de Identificación de Recepción:</Typography>
            <Field 
              id="reportDate" 
              name="reportDate"
              render={() => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Fecha:</InputLabel> 
                  <DatePicker />
                </Grid>
              )}
            />
            <Field 
              id="requestType" 
              name="requestType"
              render={() => (
                <Grid container flexDirection="row" alignItems="center" columnGap={1}>
                  <InputLabel>Limpieza y Orden:</InputLabel>
                  <FormControl component="fieldset">
                    <RadioGroup aria-label="gender" defaultValue="female" name="radio-buttons-group" row>
                      <Grid flexDirection="column" columnGap={2}>
                        <FormControlLabel value="si" control={<Radio />} label="Si" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}
            />
            <Field
              id="applicant-position" 
              name="applicant-position"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Descripción:</InputLabel>
                  <TextField {...input} multiline rows={5} />
                </Grid>
              )}
            />
          </Grid>
        </form>
      )}
    />
  )
}

export default ApplicantRequestReception