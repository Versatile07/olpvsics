import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';

import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import UploadResource from './pages/UploadResource';
import Attendance from './pages/Attendance';
import Assignments from './pages/Assignments';
import Placements from './pages/Placements';
import Notices from './pages/Notices';
import ExternalCourses from './pages/ExternalCourses';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/resources" element={<RequireAuth><Resources /></RequireAuth>} />
          <Route path="/upload-resource" element={<RequireAuth><RequireRole roles={['faculty', 'admin']}><UploadResource /></RequireRole></RequireAuth>} />
          <Route path="/attendance" element={<RequireAuth><Attendance /></RequireAuth>} />
          <Route path="/assignments" element={<RequireAuth><Assignments /></RequireAuth>} />
          <Route path="/placements" element={<RequireAuth><Placements /></RequireAuth>} />
          <Route path="/notices" element={<RequireAuth><Notices /></RequireAuth>} />
          <Route path="/external-courses" element={<RequireAuth><ExternalCourses /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
