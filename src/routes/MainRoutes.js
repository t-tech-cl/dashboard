import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import RoleGuard from 'utils/route-guard/RoleGuard';
import MaintenanceRequest from 'pages/maintenance-request';
import MaintenanceUpdate from 'pages/search-document';
import MaintenanceRequestPDF from 'pages/maintenance-pdf';
import MaintenanceDB from 'pages/maintenance-db';
import UserRoles from 'pages/user-roles';


// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));

const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));
const ForbiddenPage = Loadable(lazy(() => import('pages/maintenance/forbidden')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        // {
        //   path: '/',
        //   element: <CommonLayout layout="simple" />,
        //   children: [
        //     {
        //       path: 'contact-us',
        //       element: <AppContactUS />
        //     }
        //   ]
        // },
        {
          path: '/mantenimiento/solicitud',
          element: (
            <RoleGuard allowedRoles={['Admin', 'Manager']}>
              <MaintenanceRequest />
            </RoleGuard>
          )
        },
        {
          path: '/mantenimiento/buscar-documento',
          element: <MaintenanceUpdate />
        },
        {
          path: '/mantenimiento/:id',
          element: (
            <RoleGuard allowedRoles={['Admin', 'Manager']}>
              <MaintenanceRequestPDF />
            </RoleGuard>
          )
        },
        {
          path: '/mantenimiento/base-de-datos',
          element: <MaintenanceDB />
        },
        {
          path: '/roles/usuarios',
          element: (
            <RoleGuard allowedRoles={['Admin']}>
              <UserRoles />
            </RoleGuard>
          )
        },
        {
          path: 'sample-page',
          element: <SamplePage />
        }
        // {
        //   path: 'pricing',
        //   element: <PricingPage />
        // }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '/forbidden',
      element: <CommonLayout />,
      children: [
        {
          path: '',
          element: <ForbiddenPage />
        }
      ]
    },
    {
      path: '/auth',
      element: <CommonLayout />,
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
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    }
  ]
};

export default MainRoutes;
