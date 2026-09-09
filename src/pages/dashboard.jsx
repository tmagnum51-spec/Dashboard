import React, { useState, useEffect } from 'react';
// On importe uniquement la fonction regroupée getUserById
import { getUserById } from '../services/api';
import DistanceChart from '../components/DistanceChart';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Un seul appel !
    getUserById("user123")
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error('Erreur :', error);
      });
  }, []);

  if (!userData) {
    return <div style={{ padding: '20px' }}>Chargement du tableau de bord...</div>;
  }

  return (
    <main style={{ padding: '20px' }}>
      <h1>Bonjour {userData.userInfos?.firstName} 👋</h1>

      {/* Graphique de distance */}
      <DistanceChart data={userData.runningData} />
    </main>
  );
};

export default Dashboard;