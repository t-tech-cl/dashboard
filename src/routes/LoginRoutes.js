import { lazy } from 'react';

// project import
import GuestGuard from 'utils/route-guard/GuestGuard';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));
const AuthVerifyResetCode = Loadable(lazy(() => import('pages/auth/verify-reset-code')));
const AuthNewPassword = Loadable(lazy(() => import('pages/auth/new-password')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: (
    <GuestGuard>
      <CommonLayout />
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: 'forgot-password',
      element: <AuthForgotPassword />
    },
    {
      path: 'check-mail',
      element: <AuthCheckMail />
    },
    {
      path: 'reset-password',
      element: <AuthResetPassword />
    },
    {
      path: 'code-verification',
      element: <AuthCodeVerification />
    },
    {
      path: 'verify-reset-code',
      element: <AuthVerifyResetCode />
    },
    {
      path: 'new-password',
      element: <AuthNewPassword />
    }
  ]
};

export default LoginRoutes;
