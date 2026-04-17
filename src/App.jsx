import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import InvitationPage from './pages/InvitationPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'

// Simple Auth Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Service Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Guest Route (Dynamic Invitation) */}
        <Route path="/:weddingSlug" element={<InvitationPage />} />
        
        {/* Admin Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/:weddingSlug" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
