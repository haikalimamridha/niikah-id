import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import DashboardApp from './pages/DashboardApp';
import useAuthState from './store/auth.state';

const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const RegisterWizard = lazy(() => import('./pages/RegisterWizard'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Guest = lazy(() => import('./pages/Guest'));
const NotFound = lazy(() => import('./pages/Page404'));
const Invitation = lazy(() => import('./pages/Invitation'));
const Comment = lazy(() => import('./pages/Comment'));
const Event = lazy(() => import('./pages/Event'));
const Payment = lazy(() => import('./pages/Payment'));
const Profile = lazy(() => import('./pages/Profile'));
const Gallery = lazy(() => import('./pages/Gallery'));
// ----------------------------------------------------------------------

export default function Router() {
  const isAuthenticated = useAuthState((state) => state.isLogin);

  return useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/auth" />,
      children: [
        { path: '', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'invitation', element: <Invitation /> },
        { path: 'guest', element: <Guest /> },
        { path: 'payment', element: <Payment /> },
        { path: 'comment', element: <Comment /> },
        { path: 'event', element: <Event /> },
        { path: 'profile', element: <Profile /> },
        { path: 'gallery', element: <Gallery /> },
      ],
    },
    {
      path: '/auth',
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <LogoOnlyLayout />,
      children: [
        { path: '', element: <Navigate to="/auth/login" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'register/wizard', element: <RegisterWizard /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'reset-password/:token', element: <ResetPassword /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
