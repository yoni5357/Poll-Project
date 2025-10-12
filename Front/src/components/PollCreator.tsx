

import React, { useState } from 'react';

interface PollOption {
  id: string;
  text: string;
}

interface PollCreatorProps {
  onPollCreate: (title: string, options: { text: string }[]) => void;
}

export function PollCreator({ onPollCreate }: PollCreatorProps) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);

  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([...options, { id: newId, text: '' }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a poll title');
      return;
    }

    const validOptions = options.filter(opt => opt.text.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    // Create the poll
    onPollCreate(title, validOptions.map(opt => ({ text: opt.text })));
    
    // Reset form
    setTitle('');
    setOptions([{ id: '1', text: '' }, { id: '2', text: '' }]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create a New Poll
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Poll Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Poll Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your poll question..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
          />
        </div>

        {/* Poll Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Poll Options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-8">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(option.id)}
                    className="text-red-500 hover:text-red-700 p-1 transition duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 8 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Option
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Create Poll
          </button>
        </div>
      </form>
    </div>
  );
}