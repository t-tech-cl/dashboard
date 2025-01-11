import { Checkbox, FormControlLabel, FormGroup, Grid, InputLabel, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import React from 'react'
import { Field, Form } from 'react-final-form'

const ApplicantRequestForm = () => {
  const handleSubmit = () => console.log

  const initialValues = {
    requestType: 'preventiva'
  }

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} id='xx'>
          <Grid container rowGap={2}>
            <Typography variant='h3' alignSelf="center" width="inherit" textAlign="center">Ingresa datos de Solicitud:</Typography>
            <Field 
              id="requestDate" 
              name="requestDate"
              render={() => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Fecha Solicitud:</InputLabel> 
                  <DatePicker />
                </Grid>
              )}
            />
            <Field 
              id="requestType" 
              name="requestType"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Tipo de Solicitud:</InputLabel> 
                  <FormGroup>
                    <Grid flexDirection="column" columnGap={2}>
                      <FormControlLabel control={<Checkbox defaultChecked { ...input } />} label="Preventiva" />
                      <FormControlLabel control={<Checkbox defaultChecked { ...input } />} label="Correctiva" />
                      <FormControlLabel control={<Checkbox defaultChecked { ...input } />} label="Instalaciones" />
                    </Grid>
                  </FormGroup>
                </Grid>
              )}
            />
            <Field 
              id="requestNumber" 
              name="requestNumber"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Equipo / Área:</InputLabel>
                  <TextField {...input} variant='outlined' />
                </Grid>
              )}
            />
            <Field 
              id="applicantName" 
              name="applicantName"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Marca:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field 
              id="applicant-position" 
              name="applicant-position"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Ubicación:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field 
              id="applicant-area" 
              name="applicant-area"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Número:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
          </Grid>
        </form>
      )}
    />
  )
}

export default ApplicantRequestForm