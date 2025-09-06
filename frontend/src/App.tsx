import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import NotFoundPage from "./pages/NotFound";

function Logout() {
  localStorage.clear();

  return <Navigate to="/login" />;
}

function LogoutAndRegister() {
  localStorage.clear();

  return <RegisterPage />;
}

function LogoutAndLogin() {
  localStorage.clear();

  return <LoginPage />;
}

function App() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
        path="/"
      />
      <Route
        element={
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        }
        path="/logout"
      />
      <Route element={<LogoutAndLogin />} path="/login" />
      <Route element={<LogoutAndRegister />} path="/register" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default App;
