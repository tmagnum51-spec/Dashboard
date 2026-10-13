import React, { useState, useEffect } from 'react';
// On importe uniquement la fonction regroupée getUserById
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
  const {userData,formattedStartDate, formattedEndDate, loading, error} = useDashboard();
  

  if(loading){
    return <div style={{ padding: '20px' }}>Chargement des données...</div>;
  }

  if(error){
    return <div style={{ padding: '20px', color: 'red' }}>Erreur : {error}</div>;
  }

  if (!userData) {
    return <div style={{ padding: '20px' }}>Chargement du tableau de bord...</div>;
  }

  const activityData = userData.userActivity?.runningData || userData.userActivity || [];
console.log
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
        <p className="section-subtitle">Du {formattedStartDate} au {formattedEndDate}</p>

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