import { Grid, InputLabel, TextField, Typography } from '@mui/material'
import React from 'react'
import { Field, Form } from 'react-final-form'

const ApplicantEvaluationForm = () => {
  const handleSubmit = () => console.log

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} id='xx'>
          <Grid container rowGap={2}>
          <Typography variant='h3' textAlign="center">Datos de Evaluación de Jefe de Mantenimiento:</Typography>
            <Field 
              id="requestNumber" 
              name="requestNumber"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Deriva a:</InputLabel>
                  <TextField {...input} variant='outlined' />
                </Grid>
              )}
            />
            <Field 
              id="applicantName" 
              name="applicantName"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Motivo:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field
              id="applicant-position" 
              name="applicant-position"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Observaciones:</InputLabel>
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

export default ApplicantEvaluationForm