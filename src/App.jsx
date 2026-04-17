import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import InvitationPage from './pages/InvitationPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'

// Simple Auth Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Guest Route */}
        <Route path="/" element={<InvitationPage />} />
        
        {/* Admin Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Admin Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch-all redirect to Invitation */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
