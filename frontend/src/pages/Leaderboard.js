import React, { useState, useEffect } from 'react';
import { statsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await statsAPI.getLeaderboard({ period, limit: 20 });
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-600">{index + 1}</span>;
  };

  const getRankColor = (index) => {
    if (index === 0) return 'from-yellow-100 to-yellow-50 border-yellow-300';
    if (index === 1) return 'from-gray-100 to-gray-50 border-gray-300';
    if (index === 2) return 'from-orange-100 to-orange-50 border-orange-300';
    return 'from-white to-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-indigo-600" />
            Leaderboard
          </h1>
          <p className="text-gray-600 mt-2">See how you rank against other typists</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Time' },
              { value: 'month', label: 'This Month' },
              { value: 'week', label: 'This Week' },
              { value: 'today', label: 'Today' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  period === value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`p-4 flex items-center justify-between bg-gradient-to-r ${getRankColor(index)} border-l-4 transition hover:shadow-md`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {entry.username}
                      </p>
                      <p className="text-sm text-gray-600">
                        {entry.testCount} tests completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                      {entry.maxWPM}
                    </p>
                    <p className="text-sm text-gray-600">
                      WPM · {entry.avgAccuracy}% acc
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No results for this period</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to set a record!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;