import { useState } from 'react'
import './App.css'
import AccessPage from './pages/AccessPage'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import AuthProvider from './context/AuthProvider'

type Props = {

}

function App() {

  return (
    <AuthProvider>
      <AccessPage />
    </AuthProvider>
  )
}

export default App

//npx expo install 