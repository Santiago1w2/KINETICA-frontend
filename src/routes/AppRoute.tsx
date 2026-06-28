import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AccessPageLogin from '../pages/AccessPageLogin';
import AccessPageRegister from '../pages/AccessPageRegister';
import HomePage from '../pages/HomePage';
import MainLayout from '../layouts/MainLayout';
import AboutUsPage from '../pages/AboutUsPage';
import HelpPage from '../pages/HelpPage';

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
      {
      path: "login",
      element: <AccessPageLogin />,
      },
      {
      path: "register",
      element: <AccessPageRegister />,
      },
    ],
  },
  
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

