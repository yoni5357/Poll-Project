import { useState } from 'react';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface PollData {
  id: string;
  title: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  userVote?: string;
}

interface PollProps {
  poll: PollData;
  onVote: (pollId: string, optionId: number) => void;
}

export function Poll({ poll, onVote }: PollProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleVote = () => {
    if (selectedOption !== null && !poll.hasVoted) {
      onVote(poll.id, selectedOption);
      setSelectedOption(null); // Reset selection after voting
    }
  };

  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Poll Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        {poll.title}
      </h3>

      {/* Poll Options */}
      <div className="space-y-3 mb-4">
        {poll.options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          const isUserVote = poll.userVote === option.id.toString();

          return (
            <div key={option.id} className="relative">
              {/* Voting Mode (before user has voted) */}
              {!poll.hasVoted ? (
                <button
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full text-left p-3 border-2 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-700">{option.text}</span>
                  </div>
                </button>
              ) : (
                /* Results Mode (after user has voted) */
                <div
                  className={`p-3 border-2 rounded-lg relative overflow-hidden ${
                    isUserVote ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {/* Progress bar background */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 opacity-50"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  
                  {/* Content */}
                  <div className="relative flex justify-between items-center">
                    <div className="flex items-center">
                      {isUserVote && (
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className="font-medium text-gray-700">{option.text}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{option.votes}</span>
                      <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote Button or Results Summary */}
      {!poll.hasVoted ? (
        <button
          onClick={handleVote}
          disabled={!selectedOption}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
            selectedOption !== null
              ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedOption !== null ? 'Cast Vote' : 'Select an Option'}
        </button>
      ) : (
        <div className="text-center py-2">
          <p className="text-sm text-gray-600">
            Total votes: <span className="font-semibold">{poll.totalVotes}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Thank you for voting!</p>
        </div>
      )}
    </div>
  );
}

// Export the types for use in other components
export type { PollOption, PollData };