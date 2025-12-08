import React, { useState, useEffect } from 'react';
import { typingAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const Statistics = () => {
  const [results, setResults] = useState([]);
  const [bestResults, setBestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);

      const [resultsRes, bestRes] = await Promise.all([
        typingAPI.getResults({ limit: 20 }),
        typingAPI.getBestResults(10)
      ]);

      // Ensure we always set arrays
      setResults(Array.isArray(resultsRes.data.results) ? resultsRes.data.results : []);
      setBestResults(Array.isArray(bestRes.data.results) ? bestRes.data.results : []);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setResults([]);
      setBestResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = (results || []).filter(result => {
    if (timeFilter === 'all') return true;
    const date = new Date(result.createdAt);
    const now = new Date();

    if (timeFilter === 'today') {
      return date.toDateString() === now.toDateString();
    } else if (timeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    } else if (timeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return date >= monthAgo;
    }
    return true;
  });

  const avgWpm = filteredResults.length > 0
    ? Math.round(filteredResults.reduce((sum, r) => sum + r.wpm, 0) / filteredResults.length)
    : 0;

  const avgAccuracy = filteredResults.length > 0
    ? Math.round(filteredResults.reduce((sum, r) => sum + r.accuracy, 0) / filteredResults.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Statistics</h1>
            <p className="text-gray-600 mt-2">Track your typing performance over time</p>
          </div>

          <div className="flex gap-2">
            {['all', 'today', 'week', 'month'].map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-700">Average WPM</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{avgWpm}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-700">Average Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{avgAccuracy}%</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-700">Total Tests</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{filteredResults.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Best Results</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
              </div>
            ) : bestResults.length > 0 ? (
              <div className="space-y-3">
                {bestResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{result.wpm} WPM</p>
                        <p className="text-sm text-gray-600">{result.accuracy}% accuracy</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No results yet</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{result.wpm} WPM</p>
                      <p className="text-sm text-gray-600">{result.accuracy}% · {result.timeElapsed}s</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No results for this period</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
