import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ErrorFallback from "./components/ErrorFallback";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import AssignmentTracker from "./pages/AssignmentTracker";
import Modules from "./pages/Modules";
import Analytics from "./pages/Analytics";
import Focus from "./pages/Focus";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
