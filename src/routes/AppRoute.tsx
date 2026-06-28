import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AccessPageLogin from '../pages/AccessPageLogin';
import AccessPageRegister from '../pages/AccessPageRegister';
import HomePage from '../pages/HomePage';
import MainLayout from '../layouts/MainLayout';
import AboutUsPage from '../pages/AboutUsPage';
import HelpPage from '../pages/HelpPage';
import OAuthCallback from "../pages/OAuthCallback";
import OAuthError from "../pages/OAuthError";
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true, 
        element: <HomePage />,
      },
      {
        path: 'about-us',
        element: <AboutUsPage />,
      },
      {
        path: 'help',
        element: <HelpPage />,
      },
    ],
  },
        {
    path: "/auth/",
    element: <MainLayout />,
    children: [
      {
        index: false, 
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <AccessPageLogin />,
      },
      {
        path: 'register',
        element: <AccessPageRegister />,
      },
      {
        path: 'callback',
        element: <OAuthCallback />,
      },
      {
        path: 'error',
        element: <OAuthError />,
      },
    ],
  },
  
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

