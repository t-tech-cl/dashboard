import { LoadingButton } from '@mui/lab'
import { Divider, Grid, InputLabel, TextField, Typography } from '@mui/material'
import AnimateButton from 'components/@extended/AnimateButton'
import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'

const MaintenanceUpdateForm = () => {
  const [requestInfo, setRequestInfo] = useState()
  const handleSubmit = () => console.log

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} id='xx'>
          <Grid container rowGap={2}>
            <Typography variant='h3' textAlign="center">Actualizar Solicitud de Mantenimiento:</Typography>
            <Field 
              id="requestNumber" 
              name="requestNumber"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Buscar N° de Solicitud:</InputLabel>
                  <Grid container columnGap={2} marginBottom={4}>
                    <TextField {...input} variant='outlined' sx={{flex: 1}} />
                    <LoadingButton variant="contained" color="primary" onClick={() => setRequestInfo(true)}>
                      Buscar
                    </LoadingButton>
                  </Grid>
                </Grid>
              )}
            />
            {requestInfo && (
              <>
                <Divider />
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

                <AnimateButton style={{ flex: 1 }}>
                  <LoadingButton fullWidth variant="contained" color="primary" onClick={() => setRequestInfo(true)}>
                    Actualizar
                  </LoadingButton>
                </AnimateButton>
              </>
            )}
          </Grid>
        </form>
      )}
    />
  )
}

export default MaintenanceUpdateForm