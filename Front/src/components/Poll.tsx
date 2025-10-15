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
  const [showShareModal, setShowShareModal] = useState(false);

  const handleVote = () => {
    if (selectedOption !== null && !poll.hasVoted) {
      onVote(poll.id, selectedOption);
      setSelectedOption(null);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    const pollUrl = `${window.location.origin}/poll/${poll.id}`;
    try {
      await navigator.clipboard.writeText(pollUrl);
      alert('Poll URL copied to clipboard!');
      setShowShareModal(false);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setShowShareModal(false);
    }
  };

  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Poll Header with Title and Share Button */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex-1 mr-3">
            {poll.title}
          </h3>
          <button
            onClick={handleShare}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Share this poll"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Share Poll</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">Share this poll with others:</p>
            
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-800 break-all">
                {`${window.location.origin}/poll/${poll.id}`}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Export the types for use in other components
export type { PollOption, PollData };