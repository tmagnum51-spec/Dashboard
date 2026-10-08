import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './HeartRateChart.css';

const HeartRateChart = ({ data = [] }) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  // 1. Découpage et regroupement des données par semaine (Lundi -> Dimanche)
  const weeksData = useMemo(() => {
    const sessions = Array.isArray(data) ? data : (data?.runningData || []);
    if (!sessions.length) return [];

    const daysOrder = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const sorted = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));

    const weeksMap = new Map();

    sorted.forEach((session) => {
      if (!session.date) return;
      const d = new Date(session.date);
      
      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diffToMonday));
      monday.setHours(0, 0, 0, 0);

      const weekKey = monday.toISOString();

      if (!weeksMap.has(weekKey)) {
        // Initialiser les 7 jours de la semaine avec des valeurs par défaut
        const days = daysOrder.map((dayName) => ({
          day: dayName,
          minBpm: null,
          maxBpm: null,
          avgBpm: null
        }));

        weeksMap.set(weekKey, {
          startDate: monday,
          days
        });
      }

      const weekObj = weeksMap.get(weekKey);
      
      // Index du jour (0 = Lun, 6 = Dim)
      const dayIndex = (new Date(session.date).getDay() + 6) % 7;
      
      weekObj.days[dayIndex] = {
        day: daysOrder[dayIndex],
        minBpm: session.minHeartRate || session.minBpm || 135,
        maxBpm: session.maxHeartRate || session.maxBpm || 175,
        avgBpm: session.averageHeartRate || session.avgBpm || 165
      };
    });

    return Array.from(weeksMap.values());
  }, [data]);

  // Données de la semaine active
  const currentWeek = weeksData[currentWeekIndex] || { days: [], startDate: new Date() };

  // Calcul du BPM Moyen global affiché en haut à gauche
  const overallAvgBpm = useMemo(() => {
    const validDays = currentWeek.days.filter((d) => d.avgBpm !== null);
    if (!validDays.length) return 0;
    const sum = validDays.reduce((acc, d) => acc + d.avgBpm, 0);
    return Math.round(sum / validDays.length);
  }, [currentWeek]);

  // Libellé de date ("28 mai - 04 juin")
  const dateLabel = useMemo(() => {
    if (!currentWeek.startDate) return '';
    const start = new Date(currentWeek.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const format = (d) =>
      d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).replace('.', '');

    return `${format(start)} - ${format(end)}`;
  }, [currentWeek]);

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <div className="hr-chart-card">Aucune donnée cardiaque à afficher</div>;
  }

  return (
    <div className="hr-chart-card">
      {/* En-tête avec Valeur Moyenne et Navigation */}
      <div className="hr-chart-header">
        <div className="hr-chart-title-group">
          <div className="hr-chart-value">{overallAvgBpm || 163} BPM</div>
          <div className="hr-chart-subtitle">Fréquence cardiaque moyenne</div>
        </div>

        <div className="hr-chart-nav">
          <button
            className="hr-nav-btn"
            onClick={() => setCurrentWeekIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentWeekIndex === 0}
          >
            ‹
          </button>
          <span className="hr-nav-date">{dateLabel || '28 mai - 04 juin'}</span>
          <button
            className="hr-nav-btn"
            onClick={() =>
              setCurrentWeekIndex((prev) => Math.min(weeksData.length - 1, prev + 1))
            }
            disabled={currentWeekIndex >= weeksData.length - 1}
          >
            ›
          </button>
        </div>
      </div>

      {/* Graphique ComposedChart (Barres + Ligne) */}
      <div className="hr-chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart
            data={currentWeek.days}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 13 }} 
            />
            
            <YAxis
              domain={[130, 187]}
              ticks={[130, 145, 160, 187]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />

            <Tooltip
              formatter={(value, name) => {
                if (name === 'minBpm') return [`${value} BPM`, 'Min'];
                if (name === 'maxBpm') return [`${value} BPM`, 'Max'];
                if (name === 'avgBpm') return [`${value} BPM`, 'Moyenne'];
                return [value, name];
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />

            {/* Barre 1 : Min BPM (Rose clair) */}
            <Bar
              dataKey="minBpm"
              name="minBpm"
              fill="#fbcfe8"
              barSize={14}
              radius={[6, 6, 0, 0]}
            />

            {/* Barre 2 : Max BPM (Rouge vif) */}
            <Bar
              dataKey="maxBpm"
              name="maxBpm"
              fill="#ef4444"
              barSize={14}
              radius={[6, 6, 0, 0]}
            />

            {/* Ligne Courbe Moyenne/Max avec points bleus */}
            <Line
              type="monotone"
              dataKey="avgBpm"
              name="avgBpm"
              stroke="#e0e7ff"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2563eb', stroke: '#2563eb', strokeWidth: 1 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Légende personnalisée en bas */}
      <div className="hr-chart-legend">
        <div className="legend-item">
          <span className="legend-dot min-dot"></span>
          Min
        </div>
        <div className="legend-item">
          <span className="legend-dot max-dot"></span>
          Max BPM
        </div>
        <div className="legend-item">
          <span className="legend-dot avg-dot"></span>
          Max BPM
        </div>
      </div>
    </div>
  );
};

export default HeartRateChart;