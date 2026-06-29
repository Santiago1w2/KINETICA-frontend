import { useState } from 'react'
import './App.css'
import AccessPage from './pages/access/AccessPageRegister'
import HomePage from './pages/home/HomePage'
import Navbar from './components/Navbar'
import AuthProvider from './context/AuthProvider'
import { AppRouter } from './routes/AppRoute'
import TraductorPage  from './pages/traductor/TraductorPage'

type Props = {

}

function App() {

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App

//npx expo install 