import React from 'react';
import './Profile.css';
import { useDashboard } from '../context/DashboardContext';

const Profile = () => {
  // On pioche directement tout ce dont on a besoin depuis le Context
  const { 
    userData, 
    totalDistance, 
    totalSessions, 
    totalCalories,
    maxHeartRate, 
    totalHours, 
    totalMinutes, 
    restDays, 
    loading, 
    error 
  } = useDashboard();

  if (loading) {
    return <div className="profile-loading">Chargement du profil...</div>;
  }

  if (error) {
    return <div className="profile-loading" style={{ color: 'red' }}>{error}</div>;
  }

  if (!userData) {
    return <div className="profile-loading">Aucune donnée disponible.</div>;
  }

  const info = userData.userInfos || {};
  const stats = info.stats || {}; // Pour les stats statiques si besoin (temps, calories, repos)

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
            
            {/* Temps total dynamique */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Temps total couru</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{totalHours || 27}</span>
                <span className="stat-unit-flying">h</span>
                <span className="stat-value-flying">{totalMinutes || 15}</span>
                <span className="stat-unit-flying">min</span>
              </div>
            </div>

            {/* Calories dynamiques */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Calories brûlées</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{totalCalories}</span>
                <span className="stat-unit-flying">cal</span>
              </div>
            </div>

            {/* Distance totale dynamique */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Distance totale parcourue</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{totalDistance}</span>
                <span className="stat-unit-flying">km</span>
              </div>
            </div>

            {/* Jours de repos */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Nombre de jours de repos</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{restDays}</span>
                <span className="stat-unit-flying">jours</span>
              </div>
            </div>

            {/* Plus haute frequence cardio */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Plus haute frequence cardio</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{maxHeartRate}</span>
                <span className="stat-unit-flying">BPM</span>
              </div>
            </div>

            {/* Nombre de sessions dynamique */}
            <div className="stat-box-flying">
              <span className="stat-label-flying">Nombre de sessions</span>
              <div className="stat-value-group-flying">
                <span className="stat-value-flying">{totalSessions}</span>
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