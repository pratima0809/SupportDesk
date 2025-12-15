import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TicketDetail from './pages/TicketDetail';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Route - Route based on user role */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
          </PrivateRoute>
        }
      />

      <Route
        path="/ticket/:id"
        element={
          <PrivateRoute>
            <TicketDetail />
          </PrivateRoute>
        }
      />

      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
