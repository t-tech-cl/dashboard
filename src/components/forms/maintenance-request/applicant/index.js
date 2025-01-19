import { Button, Grid, InputLabel, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { getLastRequest, updateRequest } from 'store/reducers/maintenanceRequest';

const ApplicantForm = ({ onSubmit }) => {
  const dispatch = useDispatch();

  const {
    maintenanceRequest: { requestNumber, applicant }
  } = useSelector((state) => state);
  console.log(applicant);

  useEffect(() => {
    const getData = async () => await getLastRequest();
    !requestNumber && getData();
  }, [requestNumber]);

  const initialValues = {
    requestNumber,
    name: applicant?.name || '',
    role: applicant?.role || '',
    area: applicant?.area || '',
    signature: applicant?.signature || ''
  };

  const handleOnSubmit = async ({ requestNumber, ...applicant }) => {
    await dispatch(updateRequest({ requestNumber, applicant }));
    onSubmit?.();
  };

  return (
    <Form
      onSubmit={handleOnSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit} id="xx">
          <Grid container rowGap={2}>
            <Typography variant="h3" textAlign="center" sx={{ typography: { md: 'h1' } }}>
              Ingresa numero de Solicitud y datos del solicitante:
            </Typography>
            <Field
              id="requestNumber"
              name="requestNumber"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>N° de Solicitud:</InputLabel>
                  <TextField
                    {...input}
                    variant="outlined"
                    disabled
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        WebkitTextFillColor: '#ffffff70'
                      }
                    }}
                  />
                </Grid>
              )}
            />
            <Field
              id="name"
              name="name"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Nombre:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field
              id="role"
              name="role"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Cargo:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field
              id="area"
              name="area"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Área:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Field
              id="signature"
              name="signature"
              render={({ input }) => (
                <Grid container flexDirection="column" rowGap={1}>
                  <InputLabel>Firma:</InputLabel>
                  <TextField {...input} />
                </Grid>
              )}
            />
            <Grid flexDirection="row" columnGap={4}>
              <Button onClick={() => handleOnSubmit(values)} variant="contained" color="primary">
                Siguiente
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
};

export default ApplicantForm;
