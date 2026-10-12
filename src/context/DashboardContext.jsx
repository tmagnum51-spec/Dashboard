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

  // -- Calculs globaux basés sur userActivity --
  const activities = userData?.userActivity || [];

  // Distance totale
  const totalDistance = Math.round(
    activities.reduce((acc, session) => acc + (Number(session.distance) || 0), 0) * 10
  ) / 10;
  
  // Nombre de sessions
  const totalSessions = activities.length;

  // Calories totales
  const totalCalories = activities.reduce((acc, session) => acc + (Number(session.caloriesBurned) || 0), 0);

  // 1. Calcul de la moyenne globale de la fréquence cardiaque moyenne ("average")
  const avgHeartRate = activities.length > 0 
    ? Math.round(
        activities.reduce((acc, session) => acc + (Number(session.heartRate?.average) || 0), 0) / activities.length
      )
    : 0;
    // Highst HR
    const maxHeartRate = activities.length > 0
    ? Math.max(...activities.map(session => Number(session.heartRate?.max) || 0))
    : 0;

  // Temps total couru (en supposant que session.duration ou session.time est en minutes)
  const totalMinutesAll = activities.reduce((acc, session) => acc + (Number(session.duration || session.time) || 0), 0);
  const totalHours = Math.floor(totalMinutesAll / 60);
  const totalMinutes = totalMinutesAll % 60;

  // Jours de repos (exemple : estimation basée sur l'écart ou un calcul par défaut sécurisé)
  // Si vos sessions ont des dates, on peut calculer les jours de repos, sinon on met une logique de secours
  const restDays = 9; // ou calculé dynamiquement si vous avez les dates exactes

  return (
    <DashboardContext.Provider 
      value={{ 
        userData, 
        totalDistance, 
        totalSessions, 
        totalCalories,
        avgHeartRate,
        maxHeartRate, 
        totalHours, 
        totalMinutes, 
        restDays, 
        loading, 
        error 
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);