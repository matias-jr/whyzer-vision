import type { RouteObject } from 'react-router-dom';
import App from './App';
import Index from './pages/Index';
import Newsletter from './pages/Newsletter';
import LiveSession from './pages/LiveSession';
import LiveSessionConfirmed from './pages/LiveSessionConfirmed';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ColdEmailD1A from './pages/ColdEmailD1A';
import ColdEmailD1B from './pages/ColdEmailD1B';
import ColdEmailD2A from './pages/ColdEmailD2A';
import ColdEmailD2B from './pages/ColdEmailD2B';
import NotFound from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Index /> },
      { path: 'newsletter', element: <Newsletter /> },
      { path: 'live-session', element: <LiveSession /> },
      { path: 'live-session-confirmed', element: <LiveSessionConfirmed /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-and-conditions', element: <TermsAndConditions /> },
      { path: 'd1/offer-a', element: <ColdEmailD1A /> },
      { path: 'd1/offer-b', element: <ColdEmailD1B /> },
      { path: 'd2/offer-a', element: <ColdEmailD2A /> },
      { path: 'd2/offer-b', element: <ColdEmailD2B /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
