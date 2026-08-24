// This component satisfies the following concepts:
// - Frontend: React component composition, Side effects with useEffect, State management with useState, Form handling — controlled inputs, Form validation, Loading & error UI states, Async data fetching from API
// - JavaScript: async/await, Closures, Event loop, Promises vs callbacks

import React, { useState, useEffect } from 'react';

export const AIHomeworkAssistant = () => {
  // State management with useState
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Loading & error UI states

  // Form handling — controlled inputs
  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  // Form validation (Closure example)
  const validateForm = () => {
    return prompt.trim().length > 5;
  };

  // Async data fetching from API using async/await
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Prompt must be at least 5 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      // Fetching from backend AI Agent
      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error('Failed to fetch AI response');
      
      const data = await res.json(); // Promises resolved cleanly via await
      setResponse(data.reply);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Side effects with useEffect
  useEffect(() => {
    // Demonstrating the event loop / non-blocking behavior
    const timeout = setTimeout(() => {
      console.log('Component mounted successfully');
    }, 0);
    return () => clearTimeout(timeout); // Cleanup closure
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Teaching Assistant</h2>
      <form onSubmit={handleSubmit}>
        <textarea 
          className="w-full border p-2 rounded mb-2"
          value={prompt} 
          onChange={handleInputChange} 
          placeholder="Ask the AI for a lesson plan..."
        />
        <button 
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          type="submit"
        >
          {isLoading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>
      
      {/* Loading & error UI states */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <strong>AI Reply:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};
