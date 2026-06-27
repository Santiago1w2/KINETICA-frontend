import { useState } from 'react'
import './App.css'
import AccessPage from './pages/AccessPageRegister'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import AuthProvider from './context/AuthProvider'
import { AppRouter } from './routes/AppRoute'

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