import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { user } = useAuth();
  const [quizData, setQuizData] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://afs-backend-x5k5.onrender.com/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Process quiz scores
      const quizScores = response.data.quizScores;
      const quizDataByTopic = {};
      
      quizScores.forEach(score => {
        if (!quizDataByTopic[score.topic]) {
          quizDataByTopic[score.topic] = [];
        }
        quizDataByTopic[score.topic].push({
          score: score.score,
          date: new Date(score.date).toLocaleDateString()
        });
      });

      setQuizData(quizDataByTopic);
      
      // Process interview data
      const recordings = response.data.interviewRecordings;
      setInterviewData({
        total: recordings.length,
        byDifficulty: recordings.reduce((acc, rec) => {
          const difficulty = rec.questionId.difficulty;
          acc[difficulty] = (acc[difficulty] || 0) + 1;
          return acc;
        }, {})
      });

      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const getChartData = (topic, scores) => {
    return {
      labels: scores.map(s => s.date),
      datasets: [
        {
          label: topic,
          data: scores.map(s => s.score),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Performance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quiz Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quiz Performance</h2>
          {quizData && Object.entries(quizData).map(([topic, scores]) => (
            <div key={topic} className="mb-6">
              <h3 className="text-lg font-medium mb-2">{topic}</h3>
              <div className="h-64">
                <Line data={getChartData(topic, scores)} />
              </div>
            </div>
          ))}
          {(!quizData || Object.keys(quizData).length === 0) && (
            <p className="text-gray-500">No quiz attempts yet</p>
          )}
        </div>

        {/* Interview Practice */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Interview Practice</h2>
          {interviewData && (
            <div>
              <p className="text-lg mb-4">
                Total Recordings: <span className="font-medium">{interviewData.total}</span>
              </p>
              <h3 className="text-lg font-medium mb-2">By Difficulty:</h3>
              <div className="space-y-2">
                {Object.entries(interviewData.byDifficulty).map(([difficulty, count]) => (
                  <div key={difficulty} className="flex justify-between items-center">
                    <span className="capitalize">{difficulty}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(!interviewData || interviewData.total === 0) && (
            <p className="text-gray-500">No interview recordings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;