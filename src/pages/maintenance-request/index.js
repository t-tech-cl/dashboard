import { Button, Grid, Step, StepLabel, Stepper } from '@mui/material';
import Card from 'components/card';
import ScrollableSection from 'components/scrollableSection';
import ApplicantSection from 'components/sections/applicant';
import ApplicantEvaluationSection from 'components/sections/evaluation';
import ApplicantExternalReportSection from 'components/sections/external-report';
import ApplicantRequestReceptionSection from 'components/sections/reception';
import ApplicantRequestSection from 'components/sections/request';
import AuthContext from 'contexts/AuthContext';
import { useContext, useEffect, useRef } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { getLastRequest, updateRequest } from 'store/reducers/maintenanceRequest';
import { openSnackbar } from 'store/reducers/snackbar';

const LongForm = () => {
  const sectionRefs = useRef([]);
  const dispatch = useDispatch();

  const { user } = useContext(AuthContext);

  const { requestNumber, applicant } = useSelector((state) => state.maintenanceRequest);

  const initialValues = {
    userID: user?.userID,
    requestNumber,
    ...applicant,
    requestType: 'preventiva',
    requestDate: null
  };

  useEffect(() => {
    const getData = async () => await getLastRequest();
    !requestNumber && getData();
  }, [requestNumber]);

  const handleOnSubmit = async (values) => {
    const payload = { ...values, userID: user?.userID };
    try {
      const response = await dispatch(updateRequest(payload));

      if (response.status === 200) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'La solicitud ha sido guardada',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Ocurrio un problema al intentar guardar la solicitud',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
    }
  };

  // Scroll to the next section
  const scrollToSection = (index) => {
    const nextSection = sectionRefs.current[index];
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const forms = [
    ({ values }) => (
      <Card key={0}>
        <ApplicantSection requestNumber={requestNumber} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={() => console.log(values)} variant="contained" color="primary">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    ({ form, values }) => (
      <Card key={1}>
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
      <Card key={2}>
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
      <Card key={3}>
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
      <Card key={4}>
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
    <Form
      onSubmit={handleOnSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, form, values }) => (
        <form onSubmit={handleSubmit} id="xx">
          {forms.map((Component, index) => (
            <>
              <Stepper activeStep={0} alternativeLabel>
                {[{ label: 'Label' }].map((item, index) => {
                  return (
                    <Step key={index}>
                      <StepLabel>{item.label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <ScrollableSection
                key={index}
                index={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                onComplete={index < 3 ? () => scrollToSection(index + 1) : null} // Automatically go to next section
              >
                <Component form={form} values={values} initialValues={initialValues} onSubmit={handleOnSubmit} />
              </ScrollableSection>
            </>
          ))}
        </form>
      )}
    />
  );
};

export default LongForm;
