import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import DistanceChart from '../components/DistanceChart';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    mockApi.getUserById("user123").then((data) => {
      setUserData(data);
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