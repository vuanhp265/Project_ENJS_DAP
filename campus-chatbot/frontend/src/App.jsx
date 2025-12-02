import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";
import Header from "./components/Header";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

// Admin stuff (still protected, but not in main header)
import RequireAdmin from "./components/RequireAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFaq from "./pages/AdminFaq";
import AdminPending from "./pages/AdminPending";
import AdminKB from "./pages/AdminKB";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            {/* Student Portal */}
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin area (no links in header, but still accessible) */}
            <Route
              path="/admin/dashboard"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/faq"
              element={
                <RequireAdmin>
                  <AdminFaq />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/pending"
              element={
                <RequireAdmin>
                  <AdminPending />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/kb"
              element={
                <RequireAdmin>
                  <AdminKB />
                </RequireAdmin>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
