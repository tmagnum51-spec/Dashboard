import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useDashboard } from '../context/DashboardContext';
import { getUserById } from '../services/Api';

const Profile = () => {
  // On récupère uniquement les données autorisées depuis le Context API
  const { userData, totalDistance, loading: contextLoading, error: contextError } = useDashboard();

  // États locaux pour les statistiques et le chargement local
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalCalories: 0,
    totalHours: 27,
    totalMinutes: 15,
    restDays: 0,
  });
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

    // Récupération locale des données et calculs indépendants
    getUserById(token, userId)
      .then((data) => {
        const activities = data.userActivity?.runningData || data.userActivity || data.activities || [];
        const totalSessions = activities.length;

        // Calcul de la durée totale
        const durationSum = activities.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
        const totalHours = Math.floor(durationSum / 60);
        const totalMinutes = durationSum % 60;

        // Calcul des calories brûlées 
        const totalCalories = activities.reduce((acc, curr) => {
          const cal = Number(curr.caloriesBurned) || Number(curr.calories) || 0;
          return acc + cal;
        }, 0);

        // Calcul des jours de repos basés sur la dernière semaine active
        let restDays = 0;
        if (activities.length > 0) {
          const dates = activities.map(a => new Date(a.date)).filter(d => !isNaN(d));
          if (dates.length > 0) {
            const latestDate = new Date(Math.max(...dates));

            // Début de la dernière semaine active 
            const startOfLastWeek = new Date(latestDate);
            startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);

            // Filtrer les sessions de cette dernière semaine
            const activitiesInLastWeek = activities.filter(a => {
              const d = new Date(a.date);
              return d >= startOfLastWeek && d <= latestDate;
            });

            // Nombre de jours uniques d'activité sur cette période
            const uniqueActiveDays = new Set(activitiesInLastWeek.map(a => a.date)).size;

            // Jours de repos = 7 jours - jours actifs
            restDays = Math.max(0, 7 - uniqueActiveDays);
          }
        }

        setStats({
          totalSessions,
          totalCalories,
          totalHours: totalHours || 27,
          totalMinutes: totalMinutes || 15,
          restDays,
        });
        setLocalLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des statistiques du profil :', err);
        setLocalError("Erreur lors de la récupération des statistiques.");
        setLocalLoading(false);
      });
  }, []);

  // Vérifications de sécurité avant d'accéder aux données du context
  if (contextLoading || localLoading) {
    return <div className="profile-loading">Chargement du profil...</div>;
  }

  if (contextError || localError) {
    return <div className="profile-loading" style={{ color: 'red' }}>{contextError || localError}</div>;
  }

  if (!userData) {
    return <div className="profile-loading">Aucune donnée utilisateur disponible.</div>;
  }

  // Extraction sécurisée des informations utilisateur
  const info = userData.userInfos || {};

  const formatDate = (dateString) => {
    if (!dateString) return '14 juin 2023';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <main className="profile-container">
      <div className="profile-grid">
        
        {/* COLONNE DE GAUCHE */}
        <div className="profile-left-column">
          <section className="profile-header-card">
            <div className="profile-avatar-img">
              <img 
                src={info.avatar || "../public/assets/img/avatar.jpg"} 
                alt={`${info.firstName} ${info.lastName}`} 
                className="profile-summary-avatar"
              />
            </div>
            <div className="profile-header-info">
              <h1>{info.firstName} {info.lastName}</h1>
              <p className="member-since">
                Membre depuis le {formatDate(info.createdAt)}
              </p>
            </div>
          </section>

          <section className="profile-card details-card">
            <h2>Votre profil</h2>
            <ul className="profile-details-list">
              <li>
                <span className="detail-label">Âge :</span>
                <span className="detail-value">{info.age || 29}</span>
              </li>
              <li>
                <span className="detail-label">Genre :</span>
                <span className="detail-value">{info.gender || 'Femme'}</span>
              </li>
              <li>
                <span className="detail-label">Taille :</span>
                <span className="detail-value">{info.height || '1m68'}</span>
              </li>
              <li>
                <span className="detail-label">Poids :</span>
                <span className="detail-value">{info.weight ? `${info.weight}kg` : '58kg'}</span>
              </li>
            </ul>
          </section>
        </div>

        {/* COLONNE DE DROITE : Statistiques */}
        <div className="profile-right-column">
          <div className="stats-header-flying">
            <h2>Vos statistiques</h2>
            <span className="since-date-flying">depuis le {formatDate(info.createdAt)}</span>
          </div>

          <div className="stats-flying-grid">
            
            {/* Temps total géré en local */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Temps total couru</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{stats.totalHours}</span>
                <span className="stat-unit-flying">h</span>
                <span className="stat-value-flying">{stats.totalMinutes}</span>
                <span className="stat-unit-flying">min</span>
              </div>
            </div>

            {/* Calories gérées en local */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Calories brûlées</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{stats.totalCalories}</span>
                <span className="stat-unit-flying">cal</span>
              </div>
            </div>

            {/* Distance totale provenant du Context API */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Distance totale parcourue</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{totalDistance}</span>
                <span className="stat-unit-flying">km</span>
              </div>
            </div>

            {/* Jours de repos calculés en local */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Nombre de jours de repos</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{stats.restDays}</span>
                <span className="stat-unit-flying">jours</span>
              </div>
            </div>

            {/* Nombre de sessions géré en local */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Nombre de sessions</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{stats.totalSessions}</span>
                <span className="stat-unit-flying">sessions</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
};

export default Profile;