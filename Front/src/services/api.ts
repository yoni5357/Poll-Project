const API_BASE_URL = 'http://localhost:3000';

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface PollData {
  id: string;
  title: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  userVote?: string;
  creatorUsername?: string;
}

export interface CreatePollRequest {
  title: string;
  options: string[];
  creatorUsername: string;
}

export interface VoteRequest {
  voterUsername: string;
  optionId: number;
}

// Fetch all polls for homepage
export async function fetchAllPolls(username?: string): Promise<PollData[]> {
  const url = username ? `${API_BASE_URL}/polls?username=${encodeURIComponent(username)}` : `${API_BASE_URL}/polls`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch polls');
  }
  return response.json();
}

// Create a new poll
export async function createPoll(pollData: CreatePollRequest): Promise<{ slug: string }> {
  const response = await fetch(`${API_BASE_URL}/polls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pollData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create poll');
  }
  
  return response.json();
}

// Cast a vote on a poll
export async function castVote(slug: string, voteData: VoteRequest): Promise<{ ok: boolean }> {
  const response = await fetch(`${API_BASE_URL}/polls/${slug}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voteData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cast vote');
  }
  
  return response.json();
}

// Fetch a specific poll by slug
export async function fetchPoll(slug: string, username?: string): Promise<PollData> {
  const url = username ? `${API_BASE_URL}/polls/${slug}?username=${encodeURIComponent(username)}` : `${API_BASE_URL}/polls/${slug}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch poll');
  }
  return response.json();
}

// Auth interfaces
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  user: {
    id: number;
    email: string;
    username: string;
  };
}

// Register a new user
export async function registerUser(userData: RegisterRequest): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }
  
  return response.json();
}

// Login user
export async function loginUser(loginData: LoginRequest): Promise<UserResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return response.json();
}