import React, { useState, useEffect } from "react";
import { PollCreator } from "../components/PollCreator";
import { Poll } from "../components/Poll";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
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

  // User authentication state
  const [user, setUser] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Check for existing user in localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUser(savedUsername);
    } else {
      // Load polls immediately if no saved user
      loadPolls();
    }
  }, []);

  // Fetch polls when user state changes (login/logout)
  useEffect(() => {
    if (user) {
      loadPolls();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const pollsData = await fetchAllPolls(user || undefined);
      setPolls(pollsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  // Authentication handlers
  const handleAuthSuccess = (username: string) => {
    setUser(username);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUser(null);
  };

  // Handle voting
  const handleVote = async (pollId: string, optionId: number) => {
    if (!user) {
      setShowAuth(true);
      setAuthMode('login');
      return;
    }

    try {
      await castVote(pollId, {
        voterUsername: user,
        optionId: optionId,
      });

      // Reload polls to get updated vote counts and user's vote status
      await loadPolls();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cast vote");
    }
  };

  // Handle adding new polls
  const handlePollCreate = async (
    title: string,
    options: { text: string }[]
  ) => {
    if (!user) {
      setShowAuth(true);
      setAuthMode('login');
      return;
    }

    try {
      // Create poll on backend
      await createPoll({
        title,
        options: options.map((opt) => opt.text),
        creatorUsername: user,
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
        {/* Header with user info */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome to Poll Project
            </h1>
            <p className="text-xl text-gray-600">
              Create and participate in polls with ease
            </p>
          </div>
          
          {/* User authentication section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700">Welcome, <strong>{user}</strong></span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setShowAuth(true); setAuthMode('login'); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
              >
                ×
              </button>
              {authMode === 'login' ? (
                <Login
                  onSuccess={handleAuthSuccess}
                  onSwitchToRegister={() => setAuthMode('register')}
                />
              ) : (
                <Register
                  onSuccess={handleAuthSuccess}
                  onSwitchToLogin={() => setAuthMode('login')}
                />
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                if (!user) {
                  setShowAuth(true);
                  setAuthMode('login');
                } else {
                  setShowPollCreator(!showPollCreator);
                }
              }}
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
        {showPollCreator && user && (
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
