import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { typingAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { Trophy, Clock, Target, TrendingUp, RefreshCw } from 'lucide-react';

const TypingTest = () => {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchText();
  }, []);

  useEffect(() => {
    let interval;
    if (isStarted && !isFinished) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isFinished, startTime]);

  const fetchText = async () => {
    try {
      const response = await typingAPI.getText();
      setText(response.data.text);
    } catch (error) {
      console.error('Error fetching text:', error);
      setText('The quick brown fox jumps over the lazy dog. Technology empowers us to achieve new things.');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    setInput(value);

    const correctChars = value.split('').filter((char, i) => char === text[i]).length;
    const acc = value.length > 0 ? (correctChars / value.length) * 100 : 100;
    setAccuracy(Math.round(acc));

    const timeInMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = value.trim().split(/\s+/).length;
    const calculatedWpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
    setWpm(calculatedWpm);

    if (value === text) {
      handleTestComplete(calculatedWpm, Math.round(acc));
    }
  };

  const handleTestComplete = async (finalWpm, finalAccuracy) => {
    setIsFinished(true);
    
    const correctChars = input.split('').filter((char, i) => char === text[i]).length;
    const incorrectChars = input.length - correctChars;

    try {
      await typingAPI.submitResult({
        wpm: finalWpm,
        accuracy: finalAccuracy,
        timeElapsed: Math.floor((Date.now() - startTime) / 1000),
        totalCharacters: text.length,
        correctCharacters: correctChars,
        incorrectCharacters: incorrectChars,
        textSample: text,
        sessionId: Date.now().toString(),
        device: 'desktop'
      });
    } catch (error) {
      console.error('Error submitting result:', error);
    }
  };

  const resetTest = () => {
    setInput('');
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setTimeElapsed(0);
    fetchText();
    inputRef.current?.focus();
  };

  const getCharClass = (char, index) => {
    if (index >= input.length) return 'text-gray-400';
    if (input[index] === char) return 'text-green-500 bg-green-50';
    return 'text-red-500 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Typing Speed Test</h1>
          <p className="text-gray-600 mt-2">Type the text below as fast and accurately as you can</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-700">WPM</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{wpm}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-gray-700">Accuracy</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-700">Time</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{timeElapsed}s</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 p-6 bg-gray-50 rounded-lg">
            <p className="text-xl leading-relaxed font-mono select-none">
              {text.split('').map((char, i) => (
                <span key={i} className={`${getCharClass(char, i)} transition-colors`}>
                  {char}
                </span>
              ))}
            </p>
          </div>
          
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            disabled={isFinished}
            className="w-full p-4 border-2 border-gray-300 rounded-lg font-mono text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none disabled:bg-gray-100"
            rows="5"
            placeholder="Start typing here..."
            autoFocus
          />
          
          {isFinished && (
            <div className="mt-6 text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-lg">
                <Trophy className="w-6 h-6" />
                <span className="font-semibold">Test Completed!</span>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetTest}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/statistics')}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  View Statistics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;