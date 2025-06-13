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
import UsersPage from '../pages/admin/UsersPage';
import NotificationsPage from '../pages/admin/Notification';
import SentNotifications from '../pages/admin/SentNotifications';
import CreateUserPage from '../pages/admin/CreateUserPage';
import AssignStudents from '../pages/admin/AssignSupervisors';
import NotificationsPageSupervisor from '../pages/supervisor/NotificationPage';
import NotificationsPageStudent from '../pages/student/NotificationsPage';
import StudentGuide from '../pages/student/StudentGuide';
import SupervisorGuide from '../pages/supervisor/SupervisorGuide';
import AdminGuide from '../pages/admin/AdminGuide';
import SupervisorStudents from '../pages/supervisor/Students';
import ForgotPassword from '../pages/fp';
import ResetPassword from '../pages/reset-password';
import LandingPage from '../pages/LandingPage';
import NotFound from '../pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/fp" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
            path="/admin/add-user" 
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateUserPage />  
              </ProtectedRoute>
            } 
          />


          
          <Route 
            path="/admin/sent" 
            element={
              <ProtectedRoute requiredRole="admin">
                <SentNotifications />  
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/assign" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AssignStudents />  
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/guide" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminGuide />  
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/notification" 
            element={
              <ProtectedRoute requiredRole="admin">
                <NotificationsPage />  
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UsersPage />  
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
            path="/supervisor/guide" 
            element={
              <ProtectedRoute requiredRole="supervisor">
                <SupervisorGuide />  
              </ProtectedRoute>
            } 
          />


           <Route 
            path="/supervisor/notification" 
            element={
              <ProtectedRoute requiredRole="supervisor">
                <NotificationsPageSupervisor />  
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
            path="/student/notification" 
            element={
              <ProtectedRoute requiredRole="student">
                <NotificationsPageStudent />  
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
            path="/supervisor/students" 
            element={
              <ProtectedRoute requiredRole="supervisor">
                  <SupervisorStudents />
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
              <ProtectedRoute requiredRole="student">
                <PaymentRequired/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
                <LandingPage />
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

          <Route
            path="/student/guide"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentGuide />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
                <NotFound />
            }
          />



          {/* Add other protected routes similarly */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
