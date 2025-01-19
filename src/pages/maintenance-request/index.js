import { Button, Grid } from '@mui/material';
import Card from 'components/card';
import ScrollableSection from 'components/scrollableSection';
import ApplicantSection from 'components/sections/applicant';
import ApplicantEvaluationSection from 'components/sections/evaluation';
import ApplicantExternalReportSection from 'components/sections/external-report';
import ApplicantRequestReceptionSection from 'components/sections/reception';
import ApplicantRequestSection from 'components/sections/request';
import { useEffect, useRef } from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { getLastRequest, updateRequest } from 'store/reducers/maintenanceRequest';

const LongForm = () => {
  const sectionRefs = useRef([]);
  const dispatch = useDispatch();

  const {
    maintenanceRequest: { requestNumber, applicant },
    user
  } = useSelector((state) => state);
  console.log({ user });
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
    console.log(values);
    await dispatch(updateRequest(values));
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
            <ScrollableSection
              key={index}
              index={index}
              ref={(el) => (sectionRefs.current[index] = el)}
              onComplete={index < 3 ? () => scrollToSection(index + 1) : null} // Automatically go to next section
            >
              <Component form={form} values={values} initialValues={initialValues} onSubmit={handleOnSubmit} />
            </ScrollableSection>
          ))}
        </form>
      )}
    />
  );
};

export default LongForm;
