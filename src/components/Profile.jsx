import React, { useState, useEffect, useMemo } from 'react';
import { getUserById } from '../services/Api';
import Header from '../components/header';

import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  

  useEffect(() => {
    const user = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (user) {
      getUserById(token,user)
        .then((data) => setUserData(data))
        .catch((err) => console.error('Erreur lors du chargement du profil :', err));
    }
  }, []);

  if (!userData) {
    return <div className="profile-loading">Chargement du profil...</div>;
  }

  // Sécurisation de l'accès aux données
  const info = userData.userInfos || {};
  const stats = info.stats || {};

  // Formate la date de création ("14 juin 2023")
  const formatDate = (dateString) => {
    if (!dateString) return '14 juin 2023';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  const activities = userData.userActivity || [];
  // Calcul dynamique de la distance totale parcourue à partir des activités
    // const totalDistance = useMemo(() => {
    //   if (!activities.length) return 0;
    //   const sum = activities.reduce((acc, session) => acc + (Number(session.distance) || 0), 0);
    //   return Math.round(sum * 10) / 10; // Arrondi propre à 1 décimale
    // }, [activities]);
  

  return (
    <>
      
      <main className="profile-container">
        {/* Section Entête / Avatar */}
        <section className="profile-header-card">
          <div className="profile-avatar">
            {info.firstName?.[0]}{info.lastName?.[0]}
          </div>
          <div className="profile-header-info">
            <h1>{info.firstName} {info.lastName}</h1>
            <p className="member-since">
              Membre depuis le {formatDate(info.createdAt)}
            </p>
          </div>
        </section>

        <div className="profile-grid">
          {/* Bloc de Gauche : Vos Statistiques */}
          <section className="profile-card stats-card">
            <div className="card-header">
              <h2>Vos statistiques</h2>
              <span className="since-date">depuis le {formatDate(info.createdAt)}</span>
            </div>

            <div className="stats-grid">
              {/* Temps total */}
              <div className="stat-box">
                <span className="stat-label">Temps total couru</span>
                <div className="stat-value-group">
                  <span className="stat-value">{stats.totalHours || 27}</span>
                  <span className="stat-unit">h</span>
                  <span className="stat-value">{stats.totalMinutes || 15}</span>
                  <span className="stat-unit">min</span>
                </div>
              </div>

              {/* Distance totale */}
              <div className="stat-box">
                <span className="stat-label">Distance totale parcourue</span>
                <div className="stat-value-group">
                  <span className="stat-value">{stats.totalDistance || 311}</span>
                  <span className="stat-unit">km</span>
                </div>
              </div>

              {/* Nombre de sessions */}
              <div className="stat-box">
                <span className="stat-label">Nombre de sessions</span>
                <div className="stat-value-group">
                  <span className="stat-value">{stats.totalSessions || 41}</span>
                  <span className="stat-unit">sessions</span>
                </div>
              </div>

              {/* Calories brûlées */}
              <div className="stat-box">
                <span className="stat-label">Calories brûlées</span>
                <div className="stat-value-group">
                  <span className="stat-value">{stats.totalCalories || 25000}</span>
                  <span className="stat-unit">cal</span>
                </div>
              </div>

              {/* Jours de repos */}
              <div className="stat-box">
                <span className="stat-label">Nombre de jours de repos</span>
                <div className="stat-value-group">
                  <span className="stat-value">{stats.restDays || 9}</span>
                  <span className="stat-unit">jours</span>
                </div>
              </div>
            </div>
          </section>

          {/* Bloc de Droite : Votre Profil */}
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
                <span className="detail-value">{info.weight || '58kg'}</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
};

export default Profile;