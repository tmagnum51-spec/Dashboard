import React, { useMemo } from 'react';
import './ProfileSummary.css';

const ProfileSummary = ({ userData }) => {
  if (!userData) return null;

  const info = userData.userInfos || {};
  const activities = userData.userActivity || [];

  // Calcul dynamique de la distance totale parcourue à partir des activités
  const totalDistance = useMemo(() => {
    if (!activities.length) return 0;
    const sum = activities.reduce((acc, session) => acc + (Number(session.distance) || 0), 0);
    return Math.round(sum * 10) / 10; // Arrondi propre à 1 décimale
  }, [activities]);

  return (
    <div className="profile-summary-card">
      <div className="profile-summary-user">
        <img 
          src={info.avatar || "/default-avatar.jpg"} 
          alt={`${info.firstName} ${info.lastName}`} 
          className="profile-summary-avatar"
        />
        <h2 className="profile-summary-name">
          {info.firstName} {info.lastName}
        </h2>
      </div>

      <div className="profile-summary-stats">
        <span className="summary-label">Distance totale parcourue</span>
        <div className="summary-badge">
          {totalDistance} km
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;