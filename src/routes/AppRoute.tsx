import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AccessPageLogin from '../pages/access/AccessPageLogin';
import AccessPageRegister from '../pages/access/AccessPageRegister';
import HomePage from '../pages/home/HomePage';
import MainLayout from '../layouts/MainLayout';
import AboutUsPage from '../pages/home/AboutUsPage';
import HelpPage from '../pages/home/HelpPage';
import OAuthCallback from "../pages/authGoogle/OAuthCallback";
import OAuthError from "../pages/authGoogle/OAuthError";
import TraductorPage from "../pages/traductor/TraductorPage";
import { ErrorPage } from '../pages/errors/ErrorPage';
import DashboardLayout from '../layouts/DashboardLayout';
import TextToSing from '../pages/traductor/TextToSing';
import SingToText from '../pages/traductor/SingToText';
import PerfilPage from '../pages/traductor/PerfilPage';

const router = createBrowserRouter([
{
    path: "/home",
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
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <TraductorPage />,
            },
            {
                path: "text-to-sing",
                element: <TextToSing />,
            },
            {
                path: "sing-to-text",
                element: <SingToText />,
            },
            {
                path: "perfil",
                element: <PerfilPage />,
            },
        ],
    },
    {     
        path: '/traductor',
        element: <TraductorPage />,
    },
    {
        path: "/auth/login",
        element: <AccessPageLogin />,
    },
    {
        path: "/auth/register",
        element: <AccessPageRegister />,
    },
    {
        path: "/auth/callback",
        element: <OAuthCallback />,
    },
    {
    path: "/auth/error",
    element: <OAuthError />,
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};

