import ApplicantForm from 'components/forms/maintenance-request/applicant'
import ApplicantEvaluationForm from 'components/forms/maintenance-request/evaluation'
import ApplicantExternalCompanyReport from 'components/forms/maintenance-request/external-company-report'
import ApplicantRequestReception from 'components/forms/maintenance-request/reception'
import ApplicantRequestForm from 'components/forms/maintenance-request/request'
import MaintenanceRequestStepperHorizontal from 'components/maintenance-request-stepper/horizontal'
import MaintenanceRequestStepperVertical from 'components/maintenance-request-stepper/vertical'
import React from 'react'
import { isMobile } from 'react-device-detect'

const MaintenanceRequestStepper = () => {
  const steps = [
    { label: 'Solicitante', description: <ApplicantForm/> },
    { label: 'Solicitud', description: <ApplicantRequestForm/> },
    { label: 'Evaluación del Jefe de Mantención', description: <ApplicantEvaluationForm/> },
    { label: 'Reporte de Empresa Externa', description: <ApplicantExternalCompanyReport/> },
    { label: 'Identificación de Recepción', description: <ApplicantRequestReception/> }
  ]

  return isMobile ? (
      <MaintenanceRequestStepperVertical steps={steps} />
    ) : (
      <MaintenanceRequestStepperHorizontal steps={steps} />
    )
}

export default MaintenanceRequestStepper