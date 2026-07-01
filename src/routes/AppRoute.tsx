import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import AccessPageLogin from '../pages/access/AccessPageLogin';
import AccessPageRegister from '../pages/access/AccessPageRegister';
import HomePage from '../pages/home/HomePage';
import MainLayout from '../layouts/MainLayout';
import AboutUsPage from '../pages/home/AboutUsPage';
import HelpPage from '../pages/home/HelpPage';
import OAuthCallback from "../pages/authGoogle/OAuthCallback";
import OAuthError from "../pages/authGoogle/OAuthError";
import TraductorPage from "../pages/traductor/TraductorPage";
import DashboardLayout from '../layouts/DashboardLayout';
import TextToSing from '../pages/traductor/TextToSing';
import PerfilPage from '../pages/traductor/PerfilPage';
import HomeTraductorPage from '../pages/traductor/HomeTraductorPage';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import SignsAdminPage from '../pages/traductor/SignsAdminPage';

const router = createBrowserRouter([

        {
        path: "/",
        element: <Navigate to="/home" replace />,
    },
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
    element: <ProtectedRoute />,
    children: [
        {
            path: "/dashboard",
            element: <DashboardLayout />,
            children: [
                {
                    index: true,
                    element: <HomeTraductorPage />,
                },
                {
                    path: "text-to-sing",
                    element: <TextToSing />,
                },
                {
                    path: "sing-to-text",
                    element: <TraductorPage />,
                },
                {
                    path: "perfil",
                    element: <PerfilPage />,
                },
                {
                    element: <AdminRoute />,
                    children: [
                        {
                            path: "signs-admin",
                            element: <SignsAdminPage />,
                        },
                    ],
                },
            ],
        },
    ],
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

