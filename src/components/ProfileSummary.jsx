import React from 'react';
import './ProfileSummary.css';

const ProfileSummary = ({ userData }) => {
  if (!userData) return null;

  const info = userData.userInfos || {};
  const stats = info.stats || {};

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
          {stats.totalDistance || 0} km
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;