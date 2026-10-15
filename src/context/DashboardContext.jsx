import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserById } from '../services/Api';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUserData(null);
    setLoading(true);
    
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

  // Extraction des activités pour calculer uniquement la distance totale 
  const activities = userData?.userActivity || [];

  // Calcul de la distance totale 
  const totalDistance = Math.round(
    activities.reduce((acc, session) => acc + (Number(session.distance) || 0), 0) * 10
  ) / 10;

  return (
    <DashboardContext.Provider 
      value={{ 
        userData, 
        totalDistance, 
        loading, 
        error 
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);