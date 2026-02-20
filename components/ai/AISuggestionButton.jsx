import React, { useState } from 'react';
import { FaLightbulb, FaSpinner } from 'react-icons/fa';
import { getSuggestions } from '../../utils/gemini';

const AISuggestionButton = ({ section, content }) => {
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          content
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get suggestions');
      }
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Suggestions error:', error);
      setError(error.message || 'Failed to get suggestions. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-end">
        <button
          onClick={handleGetSuggestions}
          className="bg-zinc-800 text-white p-2 rounded hover:bg-zinc-700 transition-colors"
          disabled={loading}
          title="Get AI Suggestions"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaLightbulb />}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded mt-2 shadow-md">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError('')}
            className="mt-1 text-xs text-red-500 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {suggestions && (
        <div className="bg-zinc-100 p-4 rounded mt-2 shadow-md">
          <h3 className="text-zinc-800 font-semibold mb-2 text-left">AI Suggestions:</h3>
          <div className="text-zinc-700 whitespace-pre-line">{suggestions}</div>
          <button
            onClick={() => setSuggestions('')}
            className="mt-2 bg-zinc-800 text-white px-3 py-1 rounded hover:bg-zinc-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AISuggestionButton; 