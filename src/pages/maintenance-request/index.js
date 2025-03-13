import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { Button, Typography, Grid, Stepper, Step, StepLabel, Box, Card as MuiCard, Alert } from '@mui/material';
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
import { LockOutlined, StopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const LongForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRefs = useRef([]);
  const sectionLabelRefs = useRef([]);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const {
    request: { requestNumber, ...request },
    requestList
  } = useSelector((state) => state.maintenanceRequest);

  // Check if user has permission to create/modify maintenance requests
  const hasPermission = user && (user.role === 'Admin' || user.role === 'Manager');

  // Initialize values regardless of permission
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
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      setActiveStep(activeStep + 1);
    }
  }, [activeStep]);

  const handlePreviousSection = useCallback(() => {
    const nextSection = sectionRefs.current[activeStep - 1];
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  const handleClickLabel = useCallback((index) => {
    const section = sectionRefs.current[index];
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      setActiveStep(index);
    }
  }, []);

  const handleOnSubmit = useCallback(async (values, form) => {
    try {
      await updateRequest({ requestNumber, userID: user?.userID, ...values });
      await Promise.all([getAllRequests(), getLastRequest()]);
      form.reset({ requestNumber, userID: user?.userID, externalReport: {} });
      
      const firstSection = sectionRefs.current[0];
      if (firstSection) {
        firstSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
    }
  }, [requestNumber, user?.userID]);

  const stepLabels = [
    { label: 'Identificación del solicitante' },
    { label: 'Identificación de la Solicitud' },
    { label: 'Evaluación Jefe de Mantención' },
    { label: 'Reporte Empresa Externa' },
    { label: 'Identificación de Recepción' }
  ];

  const form1 = useCallback(
    ({ form, values }) => (
      <Card>
        <ApplicantSection form={form} value={values} initialValues={initialValues} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={handleNextSection} variant="contained" color="primary" type="button">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    [initialValues, handleNextSection]
  );

  const form2 = useCallback(
    ({ form }) => (
      <Card>
        <ApplicantRequestSection form={form} initialValues={initialValues} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={handlePreviousSection} sx={{ mr: 1 }} type="button">
            Regresar
          </Button>
          <Button onClick={handleNextSection} variant="contained" color="primary" type="button">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    [handlePreviousSection, handleNextSection, initialValues]
  );

  const form3 = useCallback(
    () => (
      <Card>
        <ApplicantEvaluationSection initialValues={initialValues} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={handlePreviousSection} sx={{ mr: 1 }} type="button">
            Regresar
          </Button>
          <Button onClick={handleNextSection} variant="contained" color="primary" type="button">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    [handlePreviousSection, handleNextSection, initialValues]
  );

  const form4 = useCallback(
    ({ form, values }) => (
      <Card>
        <ApplicantExternalReportSection form={form} initialValues={initialValues} values={values} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={handlePreviousSection} sx={{ mr: 1 }} type="button">
            Regresar
          </Button>
          <Button onClick={handleNextSection} variant="contained" color="primary" type="button">
            Siguiente
          </Button>
        </Grid>
      </Card>
    ),
    [handlePreviousSection, handleNextSection, initialValues]
  );

  const form5 = useCallback(
    ({ form, values, onSubmit }) => (
      <Card>
        <ApplicantRequestReceptionSection form={form} initialValues={initialValues} values={values} />
        <Grid container flexDirection="row" justifyContent="flex-end" columnGap={2} pt={2}>
          <Button onClick={handlePreviousSection} sx={{ mr: 1 }} type="button">
            Regresar
          </Button>
          <Button onClick={() => onSubmit(values, form)} variant="contained" color="success" type="submit">
            Enviar solicitud
          </Button>
        </Grid>
      </Card>
    ),
    [handlePreviousSection, initialValues]
  );

  const forms = [form1, form2, form3, form4, form5];

  // Intersection Observer to update active step when section is in view
  useEffect(() => {
    let timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionRefs.current.forEach((ref, index) => {
            if (ref && entry.target === ref && entry.isIntersecting) {
              setActiveStep(index);
              // Prevent any "bouncing" and just center the section
              if (entry.isIntersecting) {
                // Clear any previous timeout to prevent overlapping smooth scrolling
                if (timeout) {
                  clearTimeout(timeout);
                }

                timeout = setTimeout(() => {
                  if (ref) {
                    ref.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                      inline: 'center'
                    });
                  }
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
      if (timeout) {
        clearTimeout(timeout); // Clear any lingering timeouts
      }
    };
  }, []);

  // If user doesn't have permission, show access denied message
  if (!hasPermission) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ maxWidth: '600px', width: '100%' }}
        >
          <MuiCard sx={{ p: 4, textAlign: 'center' }}>
            <StopOutlined style={{ fontSize: '4rem', color: 'error.main', marginBottom: '1rem' }} />
            <Typography variant="h3" color="error" gutterBottom>
              Acceso Restringido
            </Typography>
            <Typography variant="body1" paragraph>
              Lo sentimos, como usuario con rol <strong>{user?.role}</strong>, no tienes permisos para crear o modificar solicitudes de mantenimiento.
            </Typography>
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              Solo los usuarios con roles de Administrador o Gerente pueden acceder a esta funcionalidad.
            </Alert>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/mantenimiento/buscar-documento')}
              startIcon={<LockOutlined />}
            >
              Ir a Búsqueda de Documentos
            </Button>
          </MuiCard>
        </motion.div>
      </Box>
    );
  }

  return (
    <Grid justifyContent="center" flex={1}>
      {isMobile ? (
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          sx={{ position: 'fixed', alignContent: 'center', paddingTop: 2, left: 15, right: 5, zIndex: 100 }}
          aria-label="Maintenance request steps"
        >
          {stepLabels.map((step, index) => (
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
                  aria-label={`Go to step ${index + 1}: ${step.label}`}
                />
              </motion.div>
            </Step>
          ))}
        </Stepper>
      ) : (
        <Grid container flexDirection="column" justifyContent="center" height="100%" zIndex={100}>
          <Stepper 
            activeStep={activeStep} 
            orientation="vertical" 
            sx={{ position: 'fixed', alignContent: 'center' }} 
            style={{ zIndex: 99 }}
            aria-label="Maintenance request steps"
          >
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
                    aria-label={`Go to step ${index + 1}`}
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
          <form 
            onSubmit={handleSubmit} 
            style={{ width: '100%' }}
            aria-label="Maintenance request form"
          >
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
