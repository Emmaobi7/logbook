// src/App.jsx or wherever your routes are
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboard from '../pages/student/Dashboard';
import Logbook from '../pages/student/Logbook';
import Login from '../pages/Login';
import Register from '../pages/Register'
import ProtectedRoute from '../components/protectedRoute';
import { AuthProvider } from '../context/AuthContext';
import PaymentRequired from '../components/PaymentRequired';
import Payment from '../pages/Payment';
import SupervisorInviteForm from '../pages/student/Supervisor';
import SupervisorReviewPage from '../pages/supervisor/Review';
import SupervisorDashboard from '../pages/supervisor/Dashboard';
import StudentLogsPage from '../pages/supervisor/MyStudents';
import ExportLogs from '../pages/supervisor/Exportlogs';
import StudentProfile from '../pages/student/Profile';
import SupervisorProfile from '../pages/supervisor/Profile';
import AdminDashboard from '../pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protect student routes */}

          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />  
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/supervisor/profile" 
            element={
              <ProtectedRoute requiredRole="supervisor">
                <SupervisorProfile />  
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentProfile />  
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/supervisor/review/:token" 
            element={
              <ProtectedRoute requiredRole="supervisor">
                <SupervisorReviewPage />  
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/supervisor/export" 
            element={
              <ProtectedRoute requiredRole="supervisor">
                  <ExportLogs />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/supervisor/logs" 
            element={
              <ProtectedRoute requiredRole="supervisor">
                  <StudentLogsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/supervisor/dashboard" 
            element={
              <ProtectedRoute requiredRole="supervisor">
                  <SupervisorDashboard />
              </ProtectedRoute>
            } 
          />

          

          <Route
            path='/student/supervisor'
            element={
              <ProtectedRoute requiredRole="student">
                <SupervisorInviteForm/>
              </ProtectedRoute>
            }
          />

          <Route
            path='/payment'
            element={
              <ProtectedRoute requiredRole="student">
                <Payment/>
              </ProtectedRoute>
            }
          />


          <Route
            path='/payment-required'
            element={
              <ProtectedRoute>
                <PaymentRequired/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/logbook"
            element={
              <ProtectedRoute requiredRole="student">
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
