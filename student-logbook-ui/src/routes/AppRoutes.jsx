// src/App.jsx or wherever your routes are
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from '../pages/student/Dashboard';
import Logbook from '../pages/student/Logbook';
import Login from '../pages/Login';
import Register from '../pages/Register'
import ProtectedRoute from '../components/protectedRoute';
import { AuthProvider } from '../context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protect student routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/logbook"
            element={
              <ProtectedRoute>
                <Logbook />
              </ProtectedRoute>
            }
          />

          {/* Add other protected routes similarly */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
