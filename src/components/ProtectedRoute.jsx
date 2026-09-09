// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Remplace cette logique selon ton système d'authentification (ex: token JWT, context React, etc.)
  const isAuthenticated = Boolean(localStorage.getItem('userId') || localStorage.getItem('token'));

  if (!isAuthenticated) {
    // Redirige vers /login si non connecté
    return <Navigate to="/login" replace />;
  }

  // Affiche les routes enfants si connecté
  return <Outlet />;
}