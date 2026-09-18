import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AppointmentProvider } from './context/AppointmentContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppointmentProvider>
          <App />
        </AppointmentProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)

