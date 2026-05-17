import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Notifications from "./pages/notifications/Notifications";
import Messages from "./pages/messages/Messages";
import NotFound from "./pages/notfound/NotFound";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { currentUser } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />

          {/* Protected */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Layout showSidebars={false}>
                <Messages />
              </Layout>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
