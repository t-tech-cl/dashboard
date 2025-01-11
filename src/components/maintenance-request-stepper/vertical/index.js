import { Button, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { Box, Container } from "@mui/system"
import { useState } from "react";

const MaintenanceRequestStepperVertical = ({ steps }) => {
  const [activeStep, setActiveStep] = useState(0)

  const handleStepBack = () => setActiveStep(activeStep - 1)
  const handleNextStep = () => setActiveStep(activeStep + 1)
  
  return (
    <Container>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNextStep}
                    sx={{ mt: 1, mr: 1 }}
                    color={index === steps.length - 1 ? 'success' : 'primary'}
                  >
                    {index === steps.length - 1 ? 'Enviar solicitud' : 'Continuar'}
                  </Button>
                  <Button disabled={index === 0} onClick={handleStepBack} sx={{ mt: 1, mr: 1 }}>
                    Regresar
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Box sx={{ pt: 2 }}>
          <Typography sx={{ color: 'success.main' }}>All steps completed - you&apos;re finished</Typography>
          <Button size="small" variant="contained" color="error" onClick={handleStepBack} sx={{ mt: 2, mr: 1 }}>
            Reset
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default MaintenanceRequestStepperVertical