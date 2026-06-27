import { BrowserRouter, Routes, Route } from 'react-router-dom';
import  AccessPageLogin  from '../pages/AccessPageLogin';
import AccessPageRegister  from '../pages/AccessPageRegister';
import HomePage from '../pages/HomePage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AccessPageLogin />} />
        <Route path="/register" element={< AccessPageRegister />} />
      </Routes>
    </BrowserRouter>
  );
};