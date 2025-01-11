import { Grid, InputLabel, TextField, Typography } from '@mui/material'
import React from 'react'
import { Field, Form } from 'react-final-form'

const ApplicantForm = () => {
  const handleSubmit = () => console.log

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} id='xx'>
          <Grid container rowGap={2}>
            <Typography variant='h3' textAlign="center">Ingresa numero de Solicitud y datos del solicitante:</Typography>
            <Field 
              id="requestNumber" 
              name="requestNumber"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>N° de Solicitud:</InputLabel>
                  <TextField {...input} variant='outlined' />
                </Grid>
              )}
            />
            <Field 
              id="applicantName" 
              name="applicantName"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Nombre:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field 
              id="applicant-position" 
              name="applicant-position"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Cargo:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field 
              id="applicant-area" 
              name="applicant-area"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Área:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field 
              id="applicant-signature" 
              name="applicant-signature"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Firma:</InputLabel>
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

export default ApplicantForm