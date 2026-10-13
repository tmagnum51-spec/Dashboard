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

  // -- Données de base --
  const activities = userData?.userActivity || [];
  const userInfo = userData?.userInfos || {};

  // 1. Récupérer l'objectif hebdomadaire (ou 6 par défaut)
  const weeklyGoal = userInfo.weeklyGoal || 6;

  // 2. Trouver la date la plus récente pour gérer proprement les fausses données (mock)
  const latestDate = activities.length > 0 
    ? new Date(Math.max(...activities.map(s => new Date(s.date)))) 
    : new Date();

  // 3. Définir le début de la dernière semaine active (7 jours glissants)
  const startOfLastWeek = new Date(latestDate);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);

  const formatDateFr = (date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formattedStartDate = formatDateFr(startOfLastWeek);
  const formattedEndDate = formatDateFr(latestDate);

  // 4. Filtrer les sessions de cette dernière semaine active
  const currentWeekActivities = activities.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= startOfLastWeek && sessionDate <= latestDate;
  });

  const completedWeeklySessions = currentWeekActivities.length;

  // 5. Calculer les sessions restantes pour l'objectif
  const remainingWeeklySessions = Math.max(0, weeklyGoal - completedWeeklySessions);

  // Distance totale
  const totalDistance = Math.round(
    activities.reduce((acc, session) => acc + (Number(session.distance) || 0), 0) * 10
  ) / 10;
  
  // Nombre total de sessions
  const totalSessions = activities.length;

  // Calories totales
  const totalCalories = activities.reduce((acc, session) => acc + (Number(session.caloriesBurned) || 0), 0);

  // Moyenne globale de la fréquence cardiaque
  const avgHeartRate = activities.length > 0 
    ? Math.round(
        activities.reduce((acc, session) => acc + (Number(session.heartRate?.average) || 0), 0) / activities.length
      )
    : 0;
    
  // Fréquence cardiaque max absolue
  const maxHeartRate = activities.length > 0
    ? Math.max(...activities.map(session => Number(session.heartRate?.max) || 0))
    : 0;

  // Temps total couru
  const totalMinutesAll = activities.reduce((acc, session) => acc + (Number(session.duration || session.time) || 0), 0);
  const totalHours = Math.floor(totalMinutesAll / 60);
  const totalMinutes = totalMinutesAll % 60;

  // Jours de repos
  const restDays = 9;

  return (
    <DashboardContext.Provider 
      value={{ 
        weeklyGoal,
        currentWeekActivities,
        formattedStartDate,
        formattedEndDate,
        completedWeeklySessions,
        remainingWeeklySessions,
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