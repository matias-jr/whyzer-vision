import type { RouteObject } from 'react-router-dom';
import App from './App';
import Index from './pages/Index';
import Newsletter from './pages/Newsletter';
import LiveSession from './pages/LiveSession';
import LiveSessionConfirmed from './pages/LiveSessionConfirmed';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
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
      { path: '*', element: <NotFound /> },
    ],
  },
];
