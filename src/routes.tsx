import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';
import App from './App';
import Index from './pages/Index';

type PageModule = { default: ComponentType };

// Routes other than the home page load on demand, so a visitor only downloads the code
// for the page they open (admin tools and the rich-text editor stay out of the home bundle).
// Keep each `lazy` as a literal `() => import('...')`: vite-react-ssg reads that source to
// link the page's CSS into the prerendered HTML.
const page = (m: PageModule) => ({ Component: m.default });

const guardedPage = async (m: PageModule) => {
  const { default: RequireAuth } = await import('./components/admin/RequireAuth');
  const Page = m.default;
  return {
    Component: () => (
      <RequireAuth>
        <Page />
      </RequireAuth>
    ),
  };
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Index /> },
      { path: 'newsletter', lazy: () => import('./pages/Newsletter').then(page) },
      { path: 'live-session', lazy: () => import('./pages/LiveSession').then(page) },
      { path: 'live-session-confirmed', lazy: () => import('./pages/LiveSessionConfirmed').then(page) },
      { path: 'privacy-policy', lazy: () => import('./pages/PrivacyPolicy').then(page) },
      { path: 'terms-and-conditions', lazy: () => import('./pages/TermsAndConditions').then(page) },
      { path: 'd1a', lazy: () => import('./pages/ColdEmailD1A').then(page) },
      { path: 'd1b', lazy: () => import('./pages/ColdEmailD1B').then(page) },
      { path: 'd2a', lazy: () => import('./pages/ColdEmailD2A').then(page) },
      { path: 'd2b', lazy: () => import('./pages/ColdEmailD2B').then(page) },
      { path: 'elite-upgrade', lazy: () => import('./pages/EliteUpgrade').then(page) },
      { path: 'free-trial', lazy: () => import('./pages/FreeTrial').then(page) },
      { path: 'live-centralize', lazy: () => import('./pages/LiveCentralize').then(page) },
      { path: 'live-centralize-registered', lazy: () => import('./pages/LiveCentralizeRegistered').then(page) },
      { path: 'financial-fluency', lazy: () => import('./pages/WebinarRegistration').then(page) },
      { path: 'financial-fluency-watch', lazy: () => import('./pages/WebinarThankYou').then(page) },
      { path: 'procurement-session', lazy: () => import('./pages/ProcurementSession').then(page) },
      { path: 'procurement-session-watch', lazy: () => import('./pages/ProcurementSessionWatch').then(page) },
      { path: 'newsletter/archive', lazy: () => import('./pages/NewsletterArchive').then(page) },
      { path: 'newsletter/:slug', lazy: () => import('./pages/NewsletterPost').then(page) },
      { path: 'admin', lazy: () => import('./pages/admin/Login').then(page) },
      {
        path: 'admin/articles',
        lazy: () => import('./pages/admin/ArticlesList').then(guardedPage),
      },
      {
        path: 'admin/articles/new',
        lazy: () => import('./pages/admin/ArticleEditor').then(guardedPage),
      },
      {
        path: 'admin/articles/:id/edit',
        lazy: () => import('./pages/admin/ArticleEditor').then(guardedPage),
      },
      {
        path: 'admin/attribution',
        lazy: () => import('./pages/admin/Attribution').then(guardedPage),
      },
      {
        path: 'admin/live-session',
        lazy: () => import('./pages/admin/LiveSessionConfig').then(guardedPage),
      },
      { path: '404', lazy: () => import('./pages/NotFound').then(page) },
      { path: '*', lazy: () => import('./pages/NotFound').then(page) },
    ],
  },
];
