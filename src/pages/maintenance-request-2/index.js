import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { Button, Typography, Grid, Stepper, Step, StepLabel } from '@mui/material';
import { getAllRequests, getLastRequest } from 'store/reducers/maintenanceRequest';
import { useSelector } from 'react-redux';
import ScrollableSection from 'components/scrollableSection';
import ApplicantSection from 'components/sections/applicant';
import ApplicantRequestSection from 'components/sections/request';
import ApplicantEvaluationSection from 'components/sections/evaluation';
import ApplicantExternalReportSection from 'components/sections/external-report';
import ApplicantRequestReceptionSection from 'components/sections/reception';
import AuthContext from 'contexts/AuthContext';
import Card from 'components/card';

// const validate = (values) => {
//   const errors = {};
//   if (!values.fullName) {
//     errors.fullName = 'Full Name is required';
//   }
//   if (!values.email) {
//     errors.email = 'Email is required';
//   } else if (!/\S+@\S+\.\S+/.test(values.email)) {
//     errors.email = 'Invalid email address';
//   }
//   if (!values.phone) {
//     errors.phone = 'Phone Number is required';
//   }
//   return errors;
// };

const LongForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRefs = useRef([]);

  // const dispatch = useDispatch();

  const { user } = useContext(AuthContext);

  const { requestNumber, requestList } = useSelector((state) => state.maintenanceRequest);

  const initialValues = {
    userID: user?.userID,
    requestNumber,
    requestType: 'preventiva',
    requestDate: null
  };

  useEffect(() => {
    const getLastRequestNumber = async () => {
      await getLastRequest();
    };

    const getAllRequestNumbers = async () => {
      await getAllRequests();
    };

    !requestNumber && getLastRequestNumber();
    !requestList?.length && getAllRequestNumbers();
  }, [requestNumber, requestList]);

  const handleSubmit = (values) => {
    setActiveStep(activeStep + 1);
    console.log('Form Submitted:', values);
  };

  const stepLabels = [
    { label: 'Identificación del solicitante' },
    { label: 'Identificación de la Solicitud' },
    { label: 'Evaluación Jefe de Mantención' },
    { label: 'Reporte Empresa Externa' },
    { label: 'Identificación de Recepción' }
  ];

  const forms = [
    ({ values }) => (
      <Card>
        <ApplicantSection requestNumber={requestNumber} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={() => console.log(values)} variant="contained" color="primary">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    ({ form, values }) => (
      <Card>
        <ApplicantRequestSection form={form} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={console.log} sx={{ mr: 1 }}>
            Regresar
          </Button>
          <Button onClick={() => console.log(values)} variant="contained" color="primary">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    ({ values }) => (
      <Card>
        <ApplicantEvaluationSection />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={console.log} sx={{ mr: 1 }}>
            Regresar
          </Button>
          <Button onClick={() => console.log(values)} variant="contained" color="primary">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    ({ form, values }) => (
      <Card>
        <ApplicantExternalReportSection form={form} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={console.log} sx={{ mr: 1 }}>
            Regresar
          </Button>
          <Button onClick={() => console.log(values)} variant="contained" color="primary">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    ({ form, values, onSubmit }) => (
      <Card>
        <ApplicantRequestReceptionSection form={form} onSubmit={onSubmit} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={console.log} sx={{ mr: 1 }}>
            Regresar
          </Button>
          <Button onClick={() => handleOnSubmit(values)} variant="contained" color="success">
            Enviar solicitud
          </Button>
        </Grid>
      </Card>
    )
  ];

  return (
    <Grid justifyContent="center" flex={1}>
      <Grid container flexDirection="column" justifyContent="center" height="100%">
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ position: 'fixed', alignContent: 'center' }}>
          {stepLabels.map((item) => {
            return (
              <Step key={0}>
                <StepLabel>
                  <Typography variant="h5">{item.label}</Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
      <ScrollableSection ref={(el) => (sectionRefs.current[index] = el)}>
        <Form
          onSubmit={handleSubmit}
          render={({ handleSubmit, form, values }) => (
            <form onSubmit={handleSubmit}>
              {forms.map((Component, index) => (
                <Component key={index} form={form} values={values} initialValues={initialValues} onSubmit={console.log} />
              ))}
            </form>
          )}
        />
      </ScrollableSection>
    </Grid>
  );
};

export default LongForm;
