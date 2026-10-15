import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './WeeklySummary.css';

const WeeklySummary = ({ data = [], weeklyGoal = 6 }) => {
  // 1. Calcul local de la dernière semaine active basé sur les données reçues en props
  const currentWeekActivities = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const latestDate = new Date(Math.max(...data.map(s => new Date(s.date))));
    const startOfLastWeek = new Date(latestDate);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 6);

    return data.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfLastWeek && sessionDate <= latestDate;
    });
  }, [data]);

  // 2. Calculs locaux pour le résumé de la semaine
  const completedCount = currentWeekActivities.length;
  const remainingCount = Math.max(0, weeklyGoal - completedCount);

  const weeklyDuration = useMemo(() => {
    return currentWeekActivities.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  }, [currentWeekActivities]);

  const weeklyDistance = useMemo(() => {
    const sum = currentWeekActivities.reduce((acc, curr) => acc + (Number(curr.distance) || 0), 0);
    return Math.round(sum * 10) / 10;
  }, [currentWeekActivities]);

  // Données pour le Donut Chart
  const pieData = [
    { name: 'réalisées', value: completedCount, color: '#0029ff' },
    { name: 'restants', value: remainingCount, color: 'rgba(182, 189, 252, 1)' }
  ];

  return (
    <div className="weekly-summary-container">
      {/* Carte Gauche : Donut Chart & Objectif */}
      <div className="summary-card donut-card">
        <div className="donut-header">
          <span className="goal-highlight">x{completedCount}</span>
          <span className="goal-text"> sur objectif de {weeklyGoal}</span>
        </div>
        <p className="summary-subtitle">Courses hebdomadaire réalisées</p>

        <div className="donut-chart-wrapper">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="donut-legend legend-left">
            <span className="dot dot-blue"></span>
            {completedCount} réalisée{completedCount > 1 ? 's' : ''}
          </div>
          <div className="donut-legend legend-right">
            <span className="dot dot-light"></span>
            {remainingCount} restante{remainingCount > 1 ? 's' : ''} 
          </div>
        </div>
      </div>

      {/* Cartes Droite : Métriques (Durée & Distance de la semaine) */}
      <div className="summary-metrics-column">
        <div className="summary-card metric-card">
          <span className="metric-label">Durée d'activité</span>
          <div className="metric-value blue-text">
            {weeklyDuration} <span className="metric-unit">{weeklyDuration > 1 ? 'minutes' : 'minute'}</span>
          </div>
        </div>

        <div className="summary-card metric-card">
          <span className="metric-label">Distance</span>
          <div className="metric-value red-text">
            {weeklyDistance} <span className="metric-unit">{weeklyDistance > 1 ? 'kilomètres' : 'kilomètre'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;