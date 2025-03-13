import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  Collapse
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { ACCOUNT_ENDPOINTS } from 'const/urls';
import axiosServices from 'utils/axios';

// assets
import { EyeOutlined, EyeInvisibleOutlined, InfoCircleOutlined, SafetyCertificateOutlined, CheckOutlined } from '@ant-design/icons';

// ============================|| JWT - REGISTER ||============================ //

const AuthRegister = () => {
  const { register } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const location = useLocation();

  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInfoOpen, setAdminInfoOpen] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        firstname: Yup.string().max(255).required('El nombre es requerido'),
        lastname: Yup.string().max(255).required('El apellido es requerido'),
        email: Yup.string().email('Debe ser un email válido').max(255).required('El email es requerido'),
        password: Yup.string().max(255).required('La contraseña es requerida')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          if (isAdmin) {
            // Register as admin (pending approval)
            await axiosServices.post(ACCOUNT_ENDPOINTS.REGISTER_ADMIN, {
              firstname: values.firstname,
              lastname: values.lastname,
              email: values.email,
              password: values.password
            });

            setStatus({ success: true });
            setSubmitting(false);

            dispatch(
              openSnackbar({
                open: true,
                message: 'Su solicitud de administrador ha sido enviada y está pendiente de aprobación.',
                variant: 'alert',
                alert: {
                  color: 'success',
                  icon: <SafetyCertificateOutlined style={{ marginRight: '8px' }} />
                },
                close: true,
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center'
                },
                transition: 'SlideDown'
              })
            );

            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 2000);
          } else {
            // Regular user registration
            await register(values.email, values.password, values.firstname, values.lastname, location.search);

            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Tu registro fue exitoso.',
                  variant: 'alert',
                  alert: {
                    color: 'success',
                    icon: <CheckOutlined style={{ marginRight: '8px' }} />
                  },
                  close: true,
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                  },
                  transition: 'SlideDown'
                })
              );

              setTimeout(() => {
                navigate('/login', { replace: true });
              }, 2000);
            }
          }
        } catch (err) {
          console.error(err);
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="firstname-signup">Nombre*</InputLabel>
                <OutlinedInput
                  id="firstname-login"
                  type="firstname"
                  value={values.firstname}
                  name="firstname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="John"
                  fullWidth
                  error={Boolean(touched.firstname && errors.firstname)}
                />
                {touched.firstname && errors.firstname && (
                  <FormHelperText error id="helper-text-firstname-signup">
                    {errors.firstname}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="lastname-signup">Apellido*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.lastname && errors.lastname)}
                  id="lastname-signup"
                  type="lastname"
                  value={values.lastname}
                  name="lastname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Doe"
                  inputProps={{}}
                />
                {touched.lastname && errors.lastname && (
                  <FormHelperText error id="helper-text-lastname-signup">
                    {errors.lastname}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-signup">Email*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="demo@company.com"
                  inputProps={{}}
                />
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-signup">Contraseña*</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-signup"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="******"
                  inputProps={{}}
                />
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
              </Stack>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdmin}
                    onChange={(e) => {
                      setIsAdmin(e.target.checked);
                      if (e.target.checked) {
                        setAdminInfoOpen(true);
                      }
                    }}
                    name="isAdmin"
                    color="primary"
                    icon={<SafetyCertificateOutlined style={{ fontSize: '1.15rem', opacity: 0.5 }} />}
                    checkedIcon={<SafetyCertificateOutlined style={{ fontSize: '1.15rem' }} />}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="subtitle1">Solicitar privilegios de administrador</Typography>
                    <IconButton 
                      size="small"
                      color="primary"
                      onClick={() => setAdminInfoOpen(!adminInfoOpen)}
                    >
                      <InfoCircleOutlined style={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Stack>
                }
              />
              
              <Collapse in={adminInfoOpen}>
                <Alert 
                  severity="info" 
                  sx={{ mt: 1, mb: 2 }}
                  onClose={() => setAdminInfoOpen(false)}
                >
                  Al solicitar privilegios de administrador, su cuenta quedará pendiente de aprobación por parte de los administradores existentes.
                  Recibirá una notificación por correo electrónico cuando su solicitud sea aprobada o rechazada.
                </Alert>
              </Collapse>
            </Grid>
            
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {isAdmin ? 'Solicitar registro como administrador' : 'Crear cuenta'}
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthRegister;
