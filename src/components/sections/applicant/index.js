import { Autocomplete, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { memo, useState } from 'react';
import { Field } from 'react-final-form';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { getRequest, initializeRequest } from 'store/reducers/maintenanceRequest';
import colors from 'const/colors';

const ApplicantSection = memo(({ form, initialValues }) => {
  const { requestNumber, applicantName, applicantRole, applicantArea, status } = initialValues;

  const [statusColor, setStatusColor] = useState(colors[status] || '#0070c0');
  const [statusValue, setStatusValue] = useState(status);
  const { requestList } = useSelector((state) => state.maintenanceRequest);

  const handleOnChangeRequestNumber = async ({ target }) => {
    if (!target.innerText) return;

    try {
      form.reset();
      form.initialize({
        requestType: 'Preventiva',
        isClean: 'si',
        requestDate: null,
        receptionDate: null,
        status: 'ongoing',
        externalReport: {}
      });
      if (target.innerText === 'Nueva solicitud') {
        await initializeRequest();
        target.value = requestList[0].requestNumber;
      } else {
        await getRequest(target.innerText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const statusItems = [
    { text: 'En desarrollo', value: 'ongoing', color: '#0070c0' },
    { text: 'Concluido', value: 'finished', color: '#91d050' },
    { text: 'Concluido adelantado', value: 'finished_upfront', color: '#bfbfbf' },
    { text: 'Concluido atrasado', value: 'finished_delayed', color: '#ffc000' },
    { text: 'Atrasado', value: 'delayed', color: '#ff0100' }
  ];

  return (
    <Grid container flexDirection="column" rowGap={1}>
      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
        <Typography variant="h3" textAlign="center" gutterBottom>
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
              options={requestList?.map(({ requestNumber }, index) => (index === 0 ? 'Nueva solicitud' : requestNumber))}
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
        <Field name="status" initialValue={status}>
          {({ input }) => (
            <FormControl fullWidth>
              <InputLabel id="status" sx={{ color: statusColor }}>
                Estatus
              </InputLabel>
              <Select
                {...input}
                labelId="status"
                name="status"
                sx={{
                  backgroundColor: statusColor,
                  color: '#000',
                  fontWeight: 'bold'
                }}
                id="demo-simple-select"
                label="status"
                defaultValue={statusValue}
                onChange={({ target }) => {
                  setStatusValue(target.value); // Update the value
                  setStatusColor(colors[target.value] || '#0070c0'); // Update the color
                  input.onChange(target.value);
                }}
              >
                {statusItems.map((item, i) => (
                  <MenuItem
                    key={i}
                    sx={{
                      backgroundColor: item.color,
                      fontWeight: 'bold',
                      color: '#000',
                      border: '1px solid #000',
                      borderCollapse: 'collapse',
                      ':hover': { backgroundColor: item.color, filter: 'brightness(80%)' },
                      ':focus': { backgroundColor: item.color }
                    }}
                    value={item.value}
                  >
                    {item.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Field>
      </motion.div>

      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
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

      <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
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

      <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
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
