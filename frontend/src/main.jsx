import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";
import ErrorFallback from "./components/ErrorFallback";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import AssignmentTracker from "./pages/AssignmentTracker";
import Modules from "./pages/Modules";
import Analytics from "./pages/Analytics";
import Focus from "./pages/Focus";
import Settings from "./pages/Settings";
import StudyAssistant from "./pages/StudyAssistant";

const router = createBrowserRouter(
  [
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <Layout />,
          errorElement: <ErrorFallback />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: "calendar", element: <Calendar /> },
            { path: "assignments", element: <AssignmentTracker /> },
            { path: "modules", element: <Modules /> },
            { path: "analytics", element: <Analytics /> },
            { path: "focus", element: <Focus /> },
            { path: "settings", element: <Settings /> },
            { path: "assistant", element: <StudyAssistant /> },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.VITE_BASE_PATH || "/",
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
