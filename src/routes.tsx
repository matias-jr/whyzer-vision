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
import NewsletterPost from './pages/NewsletterPost';
import AdminLogin from './pages/admin/Login';
import AdminArticlesList from './pages/admin/ArticlesList';
import AdminArticleEditor from './pages/admin/ArticleEditor';
import RequireAuth from './components/admin/RequireAuth';
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
      { path: 'newsletter/:slug', element: <NewsletterPost /> },
      { path: 'admin', element: <AdminLogin /> },
      {
        path: 'admin/articles',
        element: (
          <RequireAuth>
            <AdminArticlesList />
          </RequireAuth>
        ),
      },
      {
        path: 'admin/articles/new',
        element: (
          <RequireAuth>
            <AdminArticleEditor />
          </RequireAuth>
        ),
      },
      {
        path: 'admin/articles/:id/edit',
        element: (
          <RequireAuth>
            <AdminArticleEditor />
          </RequireAuth>
        ),
      },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
