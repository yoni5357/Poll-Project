import React, { useState, useEffect } from "react";
import { PollCreator } from "../components/PollCreator";
import { Poll } from "../components/Poll";
import {
  fetchAllPolls,
  createPoll,
  castVote,
  type PollData,
} from "../services/api";

const HomePage: React.FC = () => {
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showPolls, setShowPolls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polls, setPolls] = useState<PollData[]>([]);

  // Fetch polls from API on component mount
  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const pollsData = await fetchAllPolls();
      setPolls(pollsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  // Handle voting
  const handleVote = async (pollId: string, optionId: number) => {
    try {
      // For now, we'll use a placeholder username
      // In a real app, this would come from authentication
      await castVote(pollId, {
        voterUsername: "user123",
        optionId: optionId,
      });

      // Update local state to reflect the vote
      setPolls((prevPolls) =>
        prevPolls.map((poll) => {
          if (poll.id === pollId && !poll.hasVoted) {
            const updatedOptions = poll.options.map((option) =>
              option.id === optionId
                ? { ...option, votes: option.votes + 1 }
                : option
            );

            return {
              ...poll,
              options: updatedOptions,
              totalVotes: poll.totalVotes + 1,
              hasVoted: true,
              userVote: optionId.toString(),
            };
          }
          return poll;
        })
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cast vote");
    }
  };

  // Handle adding new polls
  const handlePollCreate = async (
    title: string,
    options: { text: string }[]
  ) => {
    try {
      // Create poll on backend
      const result = await createPoll({
        title,
        options: options.map((opt) => opt.text),
        creatorUsername: "user123", // Placeholder username
      });

      // Reload polls to get the new poll from the server
      await loadPolls();
      setShowPollCreator(false); // Hide creator after adding poll
      alert("Poll created successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create poll");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Poll Project
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create and participate in polls with ease
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => setShowPollCreator(!showPollCreator)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              {showPollCreator ? "Hide Poll Creator" : "Create Poll"}
            </button>
            <button
              onClick={() => setShowPolls(!showPolls)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              {showPolls ? "Hide Polls" : "Browse Polls"}
            </button>
          </div>
        </div>

        {/* Poll Creator Section */}
        {showPollCreator && (
          <div className="mb-12">
            <PollCreator onPollCreate={handlePollCreate} />
          </div>
        )}

        {/* Polls Section */}
        {showPolls && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Active Polls
              </h2>
              <p className="text-gray-600">
                Vote on polls created by the community
              </p>
            </div>

            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading polls...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadPolls}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {polls.length > 0 ? (
                  polls.map((poll) => (
                    <Poll key={poll.id} poll={poll} onVote={handleVote} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-600">
                      No polls available. Create the first one!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
