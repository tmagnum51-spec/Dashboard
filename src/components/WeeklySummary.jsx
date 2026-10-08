import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './WeeklySummary.css';

const WeeklySummary = ({ data, weeklyGoal = 6 }) => {
  // Extraction des sessions depuis les données reçues
  const sessions = useMemo(() => {
    if (Array.isArray(data)) return data;
    return data?.runningData || data?.userActivity || [];
  }, [data]);

  // Calculs : nombre de courses réalisées, durée totale, distance totale
  const completedCount = sessions.length;
  const remainingCount = Math.max(0, weeklyGoal - completedCount);

  const totalDuration = useMemo(() => {
    return sessions.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0);
  }, [sessions]);

  const totalDistance = useMemo(() => {
    const sum = sessions.reduce((acc, curr) => acc + (Number(curr.distance) || 0), 0);
    return Math.round(sum * 10) / 10;
  }, [sessions]);

  // Données pour le Donut Chart
  const pieData = [
    { name: 'réalisées', value: completedCount, color: '#0029ff' },
    { name: 'restants', value: remainingCount, color: '#b0c2ff' }
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

          {/* Légendes personnalisées positionnées sur le Donut */}
          <div className="donut-legend legend-left">
            <span className="dot dot-blue"></span>
            {completedCount} réalisées
          </div>
          <div className="donut-legend legend-right">
            <span className="dot dot-light"></span>
            {remainingCount} restants
          </div>
        </div>
      </div>

      {/* Cartes Droite : Métriques (Durée & Distance) */}
      <div className="summary-metrics-column">
        {/* Durée */}
        <div className="summary-card metric-card">
          <span className="metric-label">Durée d'activité</span>
          <div className="metric-value blue-text">
            {totalDuration} <span className="metric-unit">minutes</span>
          </div>
        </div>

        {/* Distance */}
        <div className="summary-card metric-card">
          <span className="metric-label">Distance</span>
          <div className="metric-value red-text">
            {totalDistance} <span className="metric-unit">kilomètres</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;