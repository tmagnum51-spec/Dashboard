import React, { useState, useEffect } from 'react';
// On importe la fonction API pour récupérer les données de l'utilisateur
import { getUserById } from '../services/Api';
import DistanceChart from '../components/DistanceChart';
import Header from '../components/header';
import HeartRateChart from '../components/HeartRateChart';
import WeeklySummary from '../components/WeeklySummary';
import ProfileSummary from '../components/ProfileSummary';
import './Dashboard.css';
import Footer from '../components/Footer';
import { useDashboard } from '../context/DashboardContext';

const Dashboard = () => {
  // On ne garde dans le Context que ce qui y est autorisé (userInfos et totalDistance si besoin)
  const { userData: contextUserData, loading: contextLoading, error: contextError } = useDashboard();

  // États locaux pour gérer les données et les dates de la dernière semaine active
  const [userData, setUserData] = useState(null);
  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setLocalError("Utilisateur non authentifié.");
      setLocalLoading(false);
      return;
    }

    // Récupération locale des données pour calculer les dates de la dernière semaine
    getUserById(token, userId)
      .then((data) => {
        setUserData(data);

        const activities = data.userActivity?.runningData || data.userActivity || [];

        if (activities.length > 0) {
          // Trouver la date la plus récente parmi les activités
          const dates = activities.map(a => new Date(a.date)).filter(d => !isNaN(d));
          
          if (dates.length > 0) {
            const latestDate = new Date(Math.max(...dates));

            // Définir le début de la dernière semaine active (- 6 jours)
            const startOfLastWeek = new Date(latestDate);
            startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);

            const formatDateFr = (date) => {
              return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            };

            setFormattedStartDate(formatDateFr(startOfLastWeek));
            setFormattedEndDate(formatDateFr(latestDate));
          }
        }
        setLocalLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement du dashboard :', err);
        setLocalError("Erreur lors de la récupération des données du tableau de bord.");
        setLocalLoading(false);
      });
  }, []);

  if (contextLoading || localLoading) {
    return <div style={{ padding: '20px' }}>Chargement des données...</div>;
  }

  if (contextError || localError) {
    return <div style={{ padding: '20px', color: 'red' }}>Erreur : {contextError || localError}</div>;
  }

  if (!userData) {
    return <div style={{ padding: '20px' }}>Chargement du tableau de bord...</div>;
  }

  const activityData = userData.userActivity?.runningData || userData.userActivity || [];

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <ProfileSummary userData={userData} />

        {/* Section Performances */}
        <h2 className="section-title">Vos dernières performances</h2>
        <div className="charts-grid">
          {/* Graphique de distance */}
          <div className="card-wrapper">
            <DistanceChart data={activityData} />
          </div>
          
          {/* Graphique de Cardio */}
          <HeartRateChart data={activityData} />
        </div>

        {/* Section Résumé de la semaine */}
        <h2 className="section-title">Cette semaine</h2>
        <p className="section-subtitle">
          {formattedStartDate && formattedEndDate 
            ? `Du ${formattedStartDate} au ${formattedEndDate}` 
            : "Période récente"}
        </p>

        <div className="weekly-wrapper">
          {/* Graphique de résumé semaine */}
          <WeeklySummary data={activityData} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;