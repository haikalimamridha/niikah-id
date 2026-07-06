import { Suspense, useEffect } from 'react';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LinearProgress from '@mui/material/LinearProgress';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Router from './routes';
import ThemeConfig from './theme';
import ScrollToTop from './components/ScrollToTop';
import FeedbackAlert from './components/FeedbackAlert';
import useAppState from './store/app.state';
import useAuthState from './store/auth.state';

// ----------------------------------------------------------------------

// Create query client
export const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    useAuthState.getState().checkAuthRemotely();
    useAppState.getState().loadAppStorage();
  }, []);

  return (
    <ThemeConfig>
      <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <Suspense fallback={<LinearProgress />}>
            <Router />
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
          </Suspense>
        </LocalizationProvider>
      </QueryClientProvider>
      <FeedbackAlert />
    </ThemeConfig>
  );
}
