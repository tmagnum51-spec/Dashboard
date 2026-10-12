import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DistanceChart.css';

const DistanceChart = ({ data = [] }) => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const weeksPerBlock = 4;

  const allWeeks = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const weeksMap = new Map();

    sortedData.forEach((session) => {
      if (!session.date) return;
      const d = new Date(session.date);

      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diffToMonday));
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const weekKey = monday.toISOString();

      if (!weeksMap.has(weekKey)) {
        weeksMap.set(weekKey, {
          startDate: monday,
          endDate: sunday,
          totalDistance: 0
        });
      }

      const weekObj = weeksMap.get(weekKey);
      weekObj.totalDistance += Number(session.distance) || 0;
    });

    return Array.from(weeksMap.values());
  }, [data]);

  const visibleWeeks = useMemo(() => {
    const startIndex = currentBlockIndex * weeksPerBlock;
    return allWeeks.slice(startIndex, startIndex + weeksPerBlock);
  }, [allWeeks, currentBlockIndex]);

  const averageDistance = useMemo(() => {
    if (visibleWeeks.length === 0) return 0;
    const sum = visibleWeeks.reduce((acc, week) => acc + week.totalDistance, 0);
    return Math.round(sum / visibleWeeks.length);
  }, [visibleWeeks]);

  const chartData = useMemo(() => {
    return visibleWeeks.map((week, index) => {
      const formatDate = (dateObj) =>
        dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

      return {
        semaine: `S${index + 1}`,
        distance: Math.round(week.totalDistance * 10) / 10,
        periode: `du ${formatDate(week.startDate)} au ${formatDate(week.endDate)}`
      };
    });
  }, [visibleWeeks]);

  const dateRangeLabel = useMemo(() => {
    if (visibleWeeks.length === 0) return '';

    const formatDate = (dateObj) =>
      dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

    const firstDate = formatDate(visibleWeeks[0].startDate);
    const lastDate = formatDate(visibleWeeks[visibleWeeks.length - 1].endDate);

    return `${firstDate} - ${lastDate}`;
  }, [visibleWeeks]);

  const maxBlocks = Math.ceil(allWeeks.length / weeksPerBlock);

  if (!data || data.length === 0) return <div>Aucune course à afficher</div>;

  return (
    <div className="distance-chart-card">
      <div className="distance-chart-header">
        <div className="distance-title-group">
          <h2 className="distance-main-title">{averageDistance}km en moyenne</h2>
          <span className="distance-subtitle">Total des kilomètres 4 dernières semaines</span>
        </div>

        {/* Boutons de navigation calqués sur le design de HeartRate */}
        <div className="hr-chart-nav">
          <button 
            className="hr-nav-btn"
            onClick={() => setCurrentBlockIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentBlockIndex === 0}
          >
            ‹
          </button>
          <span className="hr-nav-date">{dateRangeLabel}</span>
          <button 
            className="hr-nav-btn"
            onClick={() => setCurrentBlockIndex((prev) => Math.min(maxBlocks - 1, prev + 1))}
            disabled={currentBlockIndex >= maxBlocks - 1}
          >
            ›
          </button>
        </div>
      </div>

      <div className="distance-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="semaine" tickLine={false} axisLine={{ stroke: '#E0E0E0' }} />
            <YAxis unit=" km" tickLine={false} axisLine={false} domain={[0, 'dataMax + 5']} />
            <Tooltip 
              formatter={(val) => [`${val} km`]}
              labelFormatter={(label, payload) => 
                payload?.[0]?.payload?.periode 
                  ? `${payload[0].payload.periode}` 
                  : label
              }
            />
            <Bar dataKey="distance" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="distance-chart-legend">
        <span className="legend-dot"></span>
        <span>Km</span>
      </div>
    </div>
  );
};

export default DistanceChart;