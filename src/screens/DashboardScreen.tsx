import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MoodData {
  date: string;
  mood: string;
}

const moodToValue = (mood: string): number => {
  switch (mood.toLowerCase()) {
    case 'positive': return 3;
    case 'neutral': return 2;
    case 'negative': return 1;
    default: return 0;
  }
};

const DashboardScreen = () => {
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) throw new Error('Authentication token not found.');
        const headers = { 'Authorization': `Bearer ${token}` };
        const userId = 1;

        const [moodResponse, insightResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/entries/user/${userId}/mood-history`, { headers }),
          axios.get(`http://localhost:8080/api/v1/users/${userId}/insights`, { headers })
        ]);

        const processedMoodData = moodResponse.data.map((item: MoodData) => ({
          date: item.date,
          value: moodToValue(item.mood)
        }));

        setMoodHistory(processedMoodData);
        setInsight(insightResponse.data.insight);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Insights</h1>
      </div>

      <div style={styles.content}>
        <div style={styles.insightCard} className="fade-in">
          <div style={styles.insightIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </div>
          <div style={styles.insightContent}>
            <h3 style={styles.insightTitle}>AI-Powered Insight</h3>
            <p style={styles.insightText}>{insight}</p>
          </div>
        </div>

        <div style={styles.chartCard} className="fade-in">
          <h3 style={styles.chartTitle}>Your Mood Journey</h3>
          <div style={styles.chartContainer}>
            <ResponsiveContainer>
              <LineChart data={moodHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[1, 2, 3]}
                  tickFormatter={(value) => ['Negative', 'Neutral', 'Positive'][value - 1]}
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Mood"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  header: {
    padding: '24px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f1f5f9',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
  },
  content: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loadingText: {
    fontSize: '16px',
    color: '#94a3b8',
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: '20px',
  },
  errorText: {
    fontSize: '16px',
    color: '#ef4444',
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    gap: '16px',
  },
  insightIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  },
  insightText: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
    fontStyle: 'italic',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
  },
  chartContainer: {
    width: '100%',
    height: '300px',
  },
};

export default DashboardScreen;
