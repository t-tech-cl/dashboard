import { Alert, Button, Grid, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Box, Container } from "@mui/system"
import { useState } from "react";

const MaintenanceRequestStepperHorizontal = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0)

  const handleStepBack = () => setActiveStep(activeStep - 1)
  const handleNextStep = () => setActiveStep(activeStep + 1)
  
  const step = steps[activeStep]
  
  return (
    <Container>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => {
          return (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Alert sx={{ my: 3 }}>All steps completed - you&apos;re finished</Alert>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={console.log} color="error" variant="contained">
              Reset
            </Button>
          </Box>
        </>
      ) : (
        <Grid container alignItems="center" justifyContent="center" flexDirection="column" marginTop={4}>
          <Grid container maxWidth={500} flexDirection="column" rowGap={2} alignItems="flex-end">
            <Typography>{step.description}</Typography>
            <Grid flexDirection="row" columnGap={4}>
              <Button disabled={activeStep === 0} onClick={handleStepBack} sx={{ mr: 1 }}>
                Regresar
              </Button>
              <Button onClick={handleNextStep} variant="contained" color={activeStep === steps.length - 1 ? 'success' : 'primary'}>
                {activeStep === steps.length - 1 ? 'Enviar solicitud' : 'Siguiente'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}

export default MaintenanceRequestStepperHorizontal