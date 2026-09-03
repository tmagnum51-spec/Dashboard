import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DistanceChart.css';

const DistanceChart = ({ data = [] }) => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const weeksPerBlock = 4;

  // 1. Découpage et cumul par semaine individuelle (du lundi au dimanche)
  const allWeeks = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const weeksMap = new Map();

    sortedData.forEach((session) => {
      if (!session.date) return;
      const d = new Date(session.date);

      // Calcul du lundi de la semaine
      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diffToMonday));
      monday.setHours(0, 0, 0, 0);

      // Dimanche de la semaine
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

  // 2. Extraction du bloc de 4 semaines courant
  const visibleWeeks = useMemo(() => {
    const startIndex = currentBlockIndex * weeksPerBlock;
    return allWeeks.slice(startIndex, startIndex + weeksPerBlock);
  }, [allWeeks, currentBlockIndex]);

  // 3. Formatage pour Recharts (S1, S2, S3, S4)
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

  // 4. Libellé d'en-tête "du XX mai au XX juin" pour la tranche globale des 4 semaines
  const dateRangeLabel = useMemo(() => {
    if (visibleWeeks.length === 0) return '';

    const formatDate = (dateObj) =>
      dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

    const firstDate = formatDate(visibleWeeks[0].startDate);
    const lastDate = formatDate(visibleWeeks[visibleWeeks.length - 1].endDate);

    return `du ${firstDate} au ${lastDate}`;
  }, [visibleWeeks]);

  const maxBlocks = Math.ceil(allWeeks.length / weeksPerBlock);

  if (!data || data.length === 0) return <div>Aucune course à afficher</div>;

  return (
    <div className="distance-chart-card">
      <div className="distance-chart-header">
        <button 
          className="distance-chart-btn"
          onClick={() => setCurrentBlockIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentBlockIndex === 0}
        >
          ←
        </button>

        <span className="distance-chart-date">{dateRangeLabel}</span>

        <button 
          className="distance-chart-btn"
          onClick={() => setCurrentBlockIndex((prev) => Math.min(maxBlocks - 1, prev + 1))}
          disabled={currentBlockIndex >= maxBlocks - 1}
        >
          →
        </button>
      </div>

      <div className="distance-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="semaine" />
            <YAxis unit=" km" />
            <Tooltip 
              formatter={(val) => [`${val} km`, 'Distance totale']}
              labelFormatter={(label, payload) => 
                payload?.[0]?.payload?.periode 
                  ? `${label} (${payload[0].payload.periode})` 
                  : label
              }
            />
            <Bar dataKey="distance" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistanceChart;