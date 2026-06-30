import './App.css'
import AuthProvider from './context/AuthProvider'
import { AppRouter } from './routes/AppRoute'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
