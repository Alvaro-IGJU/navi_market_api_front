import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AuthProvider from './contexts/AuthContext'; // Importar el proveedor
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Asegúrate de importar el archivo CSS global
import './Canvas.css'; // Asegúrate de importar el archivo CSS global
import AdminPage from './pages/AdminPage';
import CompanyPage from './pages/CompanyPage';
import AdminCreateCompanyUserPage from './pages/AdminCreateCompanyUserPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminStandsPage from './pages/AdminStandsPage';
import CanvasWrapper from './components/CanvasWrapper'; // Nuevo componente importado
import ListEventsPage from './pages/ListEventsPage';
import AdminDashboard from './pages/AdminDashboard'; // Importar el nuevo componente
import EventPage from './pages/EventPage';

const App = () => {
  return (
    <Router>
        <AuthProvider>
        <Header /> {/* Mueve la lógica de AuthContext dentro del Header */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/events" element={ <PrivateRoute><ListEventsPage /></PrivateRoute>} />
          <Route path="/events/:eventId" element={<PrivateRoute><EventPage /></PrivateRoute>} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/company"
            element={
              <PrivateRoute>
                <CompanyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/canvas"
            element={
              <PrivateRoute>
                <CanvasWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/create-company-user"
            element={
              <PrivateRoute>
                <AdminCreateCompanyUserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <PrivateRoute>
                <AdminEventsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stands"
            element={
              <PrivateRoute>
                <AdminStandsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
    </AuthProvider>
      </Router>
  );
};

export default App;
