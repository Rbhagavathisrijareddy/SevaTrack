// In-memory database for demo (you can replace with MongoDB/PostgreSQL later)

// Admin users (only sevatrack.org domain)
export const adminUsers = [
  {
    id: 'admin-001',
    email: 'admin@sevatrack.org',
    name: 'SevaTrack Admin',
    role: 'admin',
    googleId: null,
    createdAt: new Date(),
  },
];

// In-memory user storage
export const users = [];

// In-memory sessions storage
export const sessions = [];

// Google OAuth tokens (for storing verified tokens)
export const googleTokens = [];

// Field worker registrations
export const workerRegistrations = [];
