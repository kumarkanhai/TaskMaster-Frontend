import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { ThemeProvider } from "./context/ThemeContext";

import KanbanBoard from "./components/KanbanBoard";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskDetail from "./components/TaskDetail";
import ThemeToggle from "./components/ThemeToggle";
import TaskForm from "./components/TaskForm";

const ProtectedRoute = ({ element: Element }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        Loading application...
      </div>
    );
  }

  return user ? Element : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
        <ThemeToggle />

        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          <Route
            path="/"
            element={<ProtectedRoute element={<KanbanBoard />} />}
          />
          <Route
            path="/tasks/:taskId"
            element={<ProtectedRoute element={<TaskDetail />} />}
          />

          <Route
            path="/tasks/new"
            element={<ProtectedRoute element={<TaskForm />} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </TaskProvider>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  </Router>
);

export default App;
