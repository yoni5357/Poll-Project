import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Poll } from "../components/Poll";
import { fetchPoll, castVote, type PollData } from "../services/api";

const SinglePollPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUser(savedUsername);
    }
  }, []);

  // Fetch poll data
  useEffect(() => {
    const loadPoll = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        const pollData = await fetchPoll(slug, user || undefined);
        setPoll(pollData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    loadPoll();
  }, [slug, user]);

  // Handle voting
  const handleVote = async (pollId: string, optionId: number) => {
    if (!user || !poll) return;

    try {
      await castVote(pollId, {
        voterUsername: user,
        optionId: optionId,
      });

      // Reload poll to get updated vote counts and user's vote status
      const updatedPoll = await fetchPoll(slug!, user);
      setPoll(updatedPoll);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cast vote");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading poll...</p>
        </div>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Poll Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Polls
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Poll Details</h1>
        </div>

        {/* Poll */}
        <div className="max-w-2xl mx-auto">
          <Poll poll={poll} onVote={handleVote} />
          
          {/* Poll Info */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Poll Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Created by:</span> {poll.creatorUsername}</p>
              <p><span className="font-medium">Total votes:</span> {poll.totalVotes}</p>
              <p><span className="font-medium">Poll ID:</span> {poll.id}</p>
            </div>
          </div>

          {/* Authentication prompt for non-logged users */}
          {!user && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-center">
                <Link to="/" className="text-blue-600 hover:text-blue-700 underline">
                  Sign in
                </Link> to vote on this poll
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePollPage;