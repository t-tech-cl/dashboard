import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Field } from 'react-final-form';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { setCurrentRequest } from 'store/reducers/maintenanceRequest';

const ApplicantSection = memo(({ initialValues }) => {
  const { requestList } = useSelector((state) => state.maintenanceRequest);
  const { requestNumber, applicantName, applicantRole, applicantArea } = initialValues;

  const handleOnChangeRequestNumber = async ({ target }) => {
    if (!target.innerText) return;

    try {
      await setCurrentRequest(target.innerText);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid container flexDirection="column" rowGap={1}>
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
        <Typography variant="h2" textAlign="center" gutterBottom>
          Identificación del solicitante:
        </Typography>
      </motion.div>
      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
        <Field name="requestNumber">
          {({ input, meta }) => (
            <Autocomplete
              freeSolo
              onChange={handleOnChangeRequestNumber}
              defaultValue={requestNumber}
              options={requestList?.map(({ requestNumber }) => requestNumber)}
              renderInput={(params) => (
                <TextField
                  {...input}
                  {...params}
                  label="N° de Solicitud:"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={meta.touched && meta.error}
                  helperText={meta.touched && meta.error}
                />
              )}
            />
          )}
        </Field>
      </motion.div>

      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
        <Field name="applicantName" defaultValue={applicantName}>
          {({ input, meta }) => (
            <TextField
              {...input}
              label="Nombre:"
              variant="outlined"
              fullWidth
              margin="normal"
              error={meta.touched && meta.error}
              helperText={meta.touched && meta.error}
            />
          )}
        </Field>
      </motion.div>

      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
        <Field name="applicantRole" defaultValue={applicantRole}>
          {({ input, meta }) => (
            <TextField
              {...input}
              label="Cargo:"
              variant="outlined"
              fullWidth
              margin="normal"
              error={meta.touched && meta.error}
              helperText={meta.touched && meta.error}
            />
          )}
        </Field>
      </motion.div>

      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
        <Field name="applicantArea" defaultValue={applicantArea}>
          {({ input, meta }) => (
            <TextField
              {...input}
              label="Área:"
              variant="outlined"
              fullWidth
              margin="normal"
              error={meta.touched && meta.error}
              helperText={meta.touched && meta.error}
            />
          )}
        </Field>
      </motion.div>
    </Grid>
  );
});

export default ApplicantSection;
