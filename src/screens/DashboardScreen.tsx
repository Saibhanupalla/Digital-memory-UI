import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define types for our data
interface MoodData {
  date: string;
  mood: string;
}

// Map moods to numerical values for charting
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
        const userId = 1; // IMPORTANT: Replace with actual user ID

        // Fetch mood history and insight in parallel
        const [moodResponse, insightResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/entries/user/${userId}/mood-history`, { headers }),
          axios.get(`http://localhost:8080/api/v1/users/${userId}/insights`, { headers })
        ]);
        
        // Process mood data for the chart
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

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Your Dashboard</h1>
      
      {/* AI Insight Card */}
      <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px', marginBottom: '30px', backgroundColor: '#f9f9f9' }}>
        <h3>💡 Your Latest Insight</h3>
        <p style={{ fontStyle: 'italic' }}>"{insight}"</p>
      </div>

      {/* Mood Chart */}
      <h3>📊 Your Mood History</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={moodHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 4]} ticks={[1, 2, 3]} tickFormatter={(value) => ['Negative', 'Neutral', 'Positive'][value - 1]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" name="Mood" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardScreen;