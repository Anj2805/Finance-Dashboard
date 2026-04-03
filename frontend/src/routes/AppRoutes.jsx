import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import RecordsPage from '../pages/RecordsPage'
import RecordFormPage from '../pages/RecordFormPage'
import UsersPage from '../pages/UsersPage'
import ProtectedRoute from './ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import { ROLES } from '../utils/constants'

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route
        path="records"
        element={
          <ProtectedRoute roles={[ROLES.ANALYST, ROLES.ADMIN]}>
            <RecordsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="records/new"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <RecordFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="records/:id"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <RecordFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="users"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
)

export default AppRoutes
