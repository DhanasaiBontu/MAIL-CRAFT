// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import ComposeEmail from './pages/ComposeEmail';
import SentEmails from './pages/SentEmails';
import ScheduledEmails from './pages/ScheduledEmails';
import Login from './pages/Login';

import './styles/App.css';

/* ------------------------------------------------------------------ */
/*  Small helper: block routes if no JWT token                         */
/* ------------------------------------------------------------------ */
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

/* ------------------------------------------------------------------ */
/*  Layout that hides Navbar + Sidebar on /login                       */
/* ------------------------------------------------------------------ */
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const showChrome = pathname !== '/login';

  return (
    <div className="app-container">
      {showChrome && <Navbar />}
      <div className="main-content">
        {showChrome && <Sidebar />}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* --- Public route --- */}
          <Route path="/login" element={<Login />} />

          {/* --- Protected routes --- */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/compose"
            element={
              <RequireAuth>
                <ComposeEmail />
              </RequireAuth>
            }
          />
          <Route
            path="/sent"
            element={
              <RequireAuth>
                <SentEmails />
              </RequireAuth>
            }
          />
          <Route
            path="/scheduled"
            element={
              <RequireAuth>
                <ScheduledEmails />
              </RequireAuth>
            }
          />

          {/* --- Fallback --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
