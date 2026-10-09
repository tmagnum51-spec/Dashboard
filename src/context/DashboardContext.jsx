import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserById } from '../services/Api';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setError("Utilisateur non authentifié.");
      setLoading(false);
      return;
    }

    getUserById(token, userId)
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des données Dashboard :', err);
        setError("Erreur lors de la récupération des données.");
        setLoading(false);
      });
  }, []);

  return (
    <DashboardContext.Provider value={{ userData, loading, error }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook personnalisé pour consommer le contexte facilement
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard doit être utilisé à l'intérieur d'un DashboardProvider");
  }
  return context;
};