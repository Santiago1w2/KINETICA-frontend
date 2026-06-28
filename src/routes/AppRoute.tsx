import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AccessPageLogin from '../pages/AccessPageLogin';
import AccessPageRegister from '../pages/AccessPageRegister';
import HomePage from '../pages/HomePage';
import OAuthCallback from "../pages/OAuthCallback";
import OAuthError from "../pages/OAuthError";
import TraductorPage from "../pages/TraductorPage";

export const AppRouter = () => {
return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<AccessPageLogin />} />
        <Route path="/auth/register" element={<AccessPageRegister />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/auth/error" element={<OAuthError />} />
        <Route path="/traductor" element={<TraductorPage />} />
    </Routes>
    </BrowserRouter>
);
};