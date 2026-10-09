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

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const user = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setError(null)
      setIsLoading(true)
      try {
        
        const datas = await getUserById(token, user)
        setUserData(datas)
      } catch (err) {
        setError(err.message)
        console.error('Erreur :', err);
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
   
  }, []);


  if(isLoading){
    return <div style={{ padding: '20px' }}>Chargement des données...</div>;
  }

  if(error){
    return <div style={{ padding: '20px', color: 'red' }}>Erreur : {error}</div>;
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
        <p className="section-subtitle">Du 23/06/2025 au 30/06/2025</p>

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