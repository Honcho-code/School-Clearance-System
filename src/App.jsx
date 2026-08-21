import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'

import Landing       from './pages/Landing'
import Login         from './pages/auth/Login'
import Register      from './pages/auth/Register'
import Onboarding    from './pages/auth/Onboarding'

import StudentLayout    from './pages/student/Layout'
import StudentDashboard from './pages/student/Dashboard'
import StudentApply     from './pages/student/Apply'
import StudentTrack     from './pages/student/Track'
import StudentLetter    from './pages/student/Letter'
import StudentNotifs    from './pages/student/Notifications'

import AdminLayout    from './pages/admin/Layout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminReview    from './pages/admin/Review'
import AdminFinal     from './pages/admin/Final'

import MedicalLayout    from './pages/medical/Layout'
import MedicalDashboard from './pages/medical/Dashboard'
import MedicalReview    from './pages/medical/Review'

import LibraryLayout    from './pages/library/Layout'
import LibraryDashboard from './pages/library/Dashboard'
import LibraryReview    from './pages/library/Review'

import HodLayout    from './pages/hod/Layout'
import HodDashboard from './pages/hod/Dashboard'
import HodReview    from './pages/hod/Review'

function RequireAuth({ children, roles }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

function RedirectByRole() {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  const map = { student:'/student', admin:'/admin', medical:'/medical', library:'/library', hod:'/hod' }
  return <Navigate to={map[user.role] || '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"           element={<Landing />} />
      <Route path="/login"      element={<Login />} />
      <Route path="/register"   element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard"  element={<RedirectByRole />} />

      {/* ── Student ── */}
      <Route path="/student" element={<RequireAuth roles={['student']}><StudentLayout /></RequireAuth>}>
        <Route index           element={<StudentDashboard />} />
        <Route path="apply"    element={<StudentApply />} />
        <Route path="track"    element={<StudentTrack />} />
        <Route path="letter"   element={<StudentLetter />} />
        <Route path="notifications" element={<StudentNotifs />} />
      </Route>

      {/* ── Admin ── */}
      <Route path="/admin" element={<RequireAuth roles={['admin']}><AdminLayout /></RequireAuth>}>
        <Route index           element={<AdminDashboard />} />
        <Route path="review"   element={<AdminReview />} />
        <Route path="review/:appId" element={<AdminReview />} />
        <Route path="final"    element={<AdminFinal />} />
        <Route path="final/:appId"  element={<AdminFinal />} />
      </Route>

      {/* ── Medical ── */}
      <Route path="/medical" element={<RequireAuth roles={['medical']}><MedicalLayout /></RequireAuth>}>
        <Route index           element={<MedicalDashboard />} />
        <Route path="review"   element={<MedicalReview />} />
        <Route path="review/:appId" element={<MedicalReview />} />
      </Route>

      {/* ── Library ── */}
      <Route path="/library" element={<RequireAuth roles={['library']}><LibraryLayout /></RequireAuth>}>
        <Route index           element={<LibraryDashboard />} />
        <Route path="review"   element={<LibraryReview />} />
        <Route path="review/:appId" element={<LibraryReview />} />
      </Route>

      {/* ── HOD ── */}
      <Route path="/hod" element={<RequireAuth roles={['hod']}><HodLayout /></RequireAuth>}>
        <Route index           element={<HodDashboard />} />
        <Route path="review"   element={<HodReview />} />
        <Route path="review/:appId" element={<HodReview />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
