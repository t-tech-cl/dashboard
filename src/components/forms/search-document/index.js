import { LoadingButton } from '@mui/lab';
import { Autocomplete, Chip, Grid, InputLabel, Link, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { FilePdfOutlined } from '@ant-design/icons';
import { getAllRequests } from 'store/reducers/maintenanceRequest';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import moment from 'moment';

const SearchDocumentForm = () => {
  const [request, setRequest] = useState({ show: false });
  const { requestList } = useSelector((state) => state.maintenanceRequest);

  const handleOnSubmit = (value) => setRequest(value);
  const formatText = (number) => `${number}`.padStart(6, 0);

  const handleOnChange = (input, value, reason) => {
    if (reason === 'clear') {
      setRequest({ show: false });
    } else {
      let requestNumber = value === 6 ? value : formatText(value);
      requestNumber = requestList.find((req) => req.requestNumber === requestNumber);
      setRequest(requestNumber);
    }
  };

  const handleOnClick = () => {
    if (!requestList.some((item) => item.requestNumber === request.requestNumber)) {
      return setRequest({ show: false });
    } else {
      setRequest({ ...request, show: true });
    }
  };

  useEffect(() => {
    const getAllRequestNumbers = async () => {
      await getAllRequests();
    };

    !requestList?.length && getAllRequestNumbers();
  }, [requestList]);

  const statusItems = {
    ongoing: { text: 'En desarrollo', color: '#0070c0' },
    finished: { text: 'Concluido', color: '#91d050' },
    finished_upfront: { text: 'Concluido adelantado', color: '#bfbfbf' },
    finished_delayed: { text: 'Concluido atrasado', color: '#ffc000' },
    delayed: { text: 'Atrasado', color: '#ff0100' }
  };

  return (
    <Form
      onSubmit={handleOnSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} id="xx">
          <Grid container rowGap={2} justifyContent="center">
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
              <Typography variant="h3" textAlign="center">
                Buscar documento:
              </Typography>
            </motion.div>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <Field id="requestNumber" name="requestNumber">
                {({ input }) => (
                  <Autocomplete
                    {...input}
                    freeSolo
                    onChange={handleOnChange}
                    defaultValue={request.requestNumber}
                    options={requestList.slice(1)?.map(({ requestNumber }) => requestNumber)}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <Grid container flexDirection="column" rowGap={1}>
                        <InputLabel>N° de Solicitud:</InputLabel>
                        <Grid container columnGap={2} marginBottom={4}>
                          <TextField {...params} {...input} variant="outlined" sx={{ flex: 1 }} />
                          <LoadingButton variant="contained" color="primary" onClick={handleOnClick}>
                            Buscar
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    )}
                  />
                )}
              </Field>
            </motion.div>
            {request.show && (
              <Grid
                container
                flexDirection="column"
                gap={2}
                className="border border-gray-300 bg-white shadow-lg rounded-lg flex flex-1 flex-column"
              >
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  style={{ width: '100%' }}
                >
                  <Grid container justifyContent="space-between" className="bg-gray-200 text-gray-700 w-full">
                    <Grid flex={1} className="py-3 px-6 text-left">
                      <Typography fontWeight="bold">Documento</Typography>
                    </Grid>
                    <Grid container flex={2} wrap="nowrap" justifyContent="space-between">
                      <div className="py-3 px-6 text-left bold">
                        <Typography fontWeight="bold">Estatus</Typography>
                      </div>
                      <div className="py-3 px-6 text-left bold">
                        <Typography fontWeight="bold">Fecha de actualización</Typography>
                      </div>
                    </Grid>
                  </Grid>
                </motion.div>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  style={{ width: '100%' }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    className="border-t hover:bg-gray-100 transition duration-200"
                  >
                    <Grid container flex={1} className="py-2 px-6">
                      <Link href={request.requestNumber} underline="none" sx={{}}>
                        <Typography
                          variant="body1"
                          component="span"
                          display="flex"
                          alignItems="center"
                          // sx={{ color: statusItems[request.status].color }}
                        >
                          <FilePdfOutlined style={{ marginRight: 8, fontSize: 24 }} />
                          Solicitud #{request.requestNumber}
                        </Typography>
                      </Link>
                    </Grid>

                    <Grid container flex={2} wrap="nowrap" alignItems="center" justifyContent="space-between">
                      <Chip
                        label={statusItems[request.status].text}
                        sx={{ backgroundColor: statusItems[request.status].color, color: '#000', fontWeight: 'bold' }}
                      />
                      <Grid alignItems="center" className="py-2 px-6">
                        {moment.utc(request.lastUpdateDate).format('YYYY-MM-DD')}
                      </Grid>
                    </Grid>
                  </Grid>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </form>
      )}
    />
  );
};

export default SearchDocumentForm;
