import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { Button, Typography, Grid, Stepper, Step, StepLabel } from '@mui/material';
import { getAllRequests, getLastRequest, updateRequest } from 'store/reducers/maintenanceRequest';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import ScrollableSection from 'components/scrollableSection';
import ApplicantSection from 'components/sections/applicant';
import ApplicantRequestSection from 'components/sections/request';
import ApplicantEvaluationSection from 'components/sections/evaluation';
import ApplicantExternalReportSection from 'components/sections/external-report';
import ApplicantRequestReceptionSection from 'components/sections/reception';
import AuthContext from 'contexts/AuthContext';
import Card from 'components/card';
import { isMobile } from 'react-device-detect';
import moment from 'moment';

const LongForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRefs = useRef([]);
  const sectionLabelRefs = useRef([]);

  const { user } = useContext(AuthContext);
  const {
    request: { requestNumber, ...request },
    requestList
  } = useSelector((state) => state.maintenanceRequest);

  const initialValues = useMemo(
    () => ({
      isClean: true,
      status: 'ongoing',
      ...request,
      requestDate: request?.requestDate || moment(),
      reportDate: request?.reportDate || moment(),
      userID: user?.userID,
      requestNumber
    }),
    [requestNumber, request, user?.userID]
  );

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

  const handleNextSection = useCallback(() => {
    const nextSection = sectionRefs.current[activeStep + 1];
    nextSection.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    setActiveStep(activeStep + 1);
  }, [activeStep]);

  const handlePreviousSection = useCallback(() => {
    const nextSection = sectionRefs.current[activeStep - 1];
    nextSection.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    setActiveStep(activeStep - 1);
  }, [activeStep]);

  const handleClickLabel = (index) => {
    sectionRefs.current[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });

    setActiveStep(index);
  };

  const handleOnSubmit = async (values, form) => {
    await updateRequest({ requestNumber, userID: user?.userID, ...values });

    await Promise.all([getAllRequests(), getLastRequest()]);
    form.reset({ requestNumber, userID: user?.userID, externalReport: {} });

    sectionRefs.current[0].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  };

  const stepLabels = [
    { label: 'Identificación del solicitante' },
    { label: 'Identificación de la Solicitud' },
    { label: 'Evaluación Jefe de Mantención' },
    { label: 'Reporte Empresa Externa' },
    { label: 'Identificación de Recepción' }
  ];

  const forms = [
    useCallback(
      ({ form, values }) => (
        <Card>
          <ApplicantSection form={form} value={values} initialValues={initialValues} />
          <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
            <Button onClick={handleNextSection} variant="contained" color="primary">
              Siguiente
            </Button>
          </Grid>
        </Card>
      ),
      [initialValues, handleNextSection]
    ),
    useCallback(
      ({ form }) => (
        <Card>
          <ApplicantRequestSection form={form} initialValues={initialValues} />
          <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
            <Button onClick={handlePreviousSection} sx={{ mr: 1 }}>
              Regresar
            </Button>
            <Button onClick={handleNextSection} variant="contained" color="primary">
              Siguiente
            </Button>
          </Grid>
        </Card>
      ),
      [handlePreviousSection, handleNextSection, initialValues]
    ),
    useCallback(
      () => (
        <Card>
          <ApplicantEvaluationSection initialValues={initialValues} />
          <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
            <Button onClick={handlePreviousSection} sx={{ mr: 1 }}>
              Regresar
            </Button>
            <Button onClick={handleNextSection} variant="contained" color="primary">
              Siguiente
            </Button>
          </Grid>
        </Card>
      ),
      [handlePreviousSection, handleNextSection, initialValues]
    ),
    useCallback(
      ({ form, values }) => (
        <Card>
          <ApplicantExternalReportSection form={form} initialValues={initialValues} values={values} />
          <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
            <Button onClick={handlePreviousSection} sx={{ mr: 1 }}>
              Regresar
            </Button>
            <Button onClick={handleNextSection} variant="contained" color="primary">
              Siguiente
            </Button>
          </Grid>
        </Card>
      ),
      [handlePreviousSection, handleNextSection, initialValues]
    ),
    useCallback(
      ({ form, values, onSubmit }) => (
        <Card>
          <ApplicantRequestReceptionSection form={form} initialValues={initialValues} values={values} />
          <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
            <Button onClick={handlePreviousSection} sx={{ mr: 1 }}>
              Regresar
            </Button>
            <Button onClick={() => onSubmit(values, form)} variant="contained" color="success">
              Enviar solicitud
            </Button>
          </Grid>
        </Card>
      ),
      [handlePreviousSection, initialValues]
    )
  ];

  // Intersection Observer to update active step when section is in view
  useEffect(() => {
    let timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRefs.current.forEach((ref, index) => {
            if (entry.target === ref && entry.isIntersecting) {
              setActiveStep(index);
              // Prevent any "bouncing" and just center the section
              if (entry.isIntersecting) {
                // Clear any previous timeout to prevent overlapping smooth scrolling
                clearTimeout(timeout);

                timeout = setTimeout(() => {
                  ref.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                  });
                }, 1000); // Delay scroll action to improve smoothness
              }
            }
          });
        });
      },
      { threshold: 0.2 }
    ); // Trigger when 20% is visible

    // Ensure that each section is observed
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      observer.disconnect(); // Cleanup observer
      clearTimeout(timeout); // Clear any lingering timeouts
    };
  }, []);

  return (
    <Grid justifyContent="center" flex={1}>
      {isMobile ? (
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          sx={{ position: 'fixed', alignContent: 'center', paddingTop: 2, left: 15, right: 5, zIndex: 100 }}
        >
          {stepLabels.map((_, index) => (
            <Step key={index}>
              <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
                <StepLabel
                  onClick={() => handleClickLabel(index)}
                  ref={(el) => (sectionLabelRefs.current[index] = el)}
                  style={{ zIndex: 99, cursor: 'pointer' }}
                  StepIconProps={{
                    sx: {
                      '&.Mui-completed': {
                        background: '#fff',
                        borderRadius: '24px'
                      }
                    }
                  }}
                />
              </motion.div>
            </Step>
          ))}
        </Stepper>
      ) : (
        <Grid container flexDirection="column" justifyContent="center" height="100%" zIndex={100}>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ position: 'fixed', alignContent: 'center' }} style={{ zIndex: 99 }}>
            {stepLabels.map((item, index) => (
              <Step key={index}>
                <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
                  <StepLabel
                    ref={(el) => (sectionLabelRefs.current[index] = el)}
                    onClick={() => handleClickLabel(index)}
                    style={{ zIndex: 99, cursor: 'pointer' }}
                    StepIconProps={{
                      sx: {
                        '&.Mui-completed': {
                          background: '#fff',
                          borderRadius: '24px'
                        }
                      }
                    }}
                  >
                    <Typography variant="h5">{item.label}</Typography>
                  </StepLabel>
                </motion.div>
              </Step>
            ))}
          </Stepper>
        </Grid>
      )}
      <Form
        onSubmit={handleOnSubmit}
        render={({ handleSubmit, form, values }) => (
          <form onSubmit={handleSubmit} style={{}}>
            <ScrollableSection style={{ height: '100vh' }}>
              {forms.map((Component, index) => (
                <div
                  ref={(el) => (sectionRefs.current[index] = el)} // Ensure each section is referenced properly
                  key={index}
                  style={{ paddingTop: '100px', paddingBottom: '100px', scrollSnapAlign: 'center' }} // Add space for visibility
                >
                  <Component
                    form={form}
                    values={values}
                    initialValues={initialValues}
                    onNext={handleNextSection}
                    onPrevious={handlePreviousSection}
                    onSubmit={handleSubmit}
                  />
                </div>
              ))}
            </ScrollableSection>
          </form>
        )}
      />
    </Grid>
  );
};

export default LongForm;
