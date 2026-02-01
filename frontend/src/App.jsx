import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotesPage from "./pages/notes/NotesPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import AssignmentsPage from "./pages/assignments/AssignmentsPage";
import PlacementsPage from "./pages/placements/PlacementsPage";
import NoticesPage from "./pages/notices/NoticesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/placements" element={<PlacementsPage />} />
        <Route path="/notices" element={<NoticesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
