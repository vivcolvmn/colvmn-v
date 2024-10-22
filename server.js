import express from 'express';
import cors from 'cors';
import pkg from 'pg'

const { Pool } = pkg;

const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'database',
    password: 'password',
    port: 5432,
});

const app = express();
app.use(cors());
app.use(express.json());

// POST: Register new user
app.post('/api/registered', async (req, res) => {
    // Extract user data, save to database, authenticate using Auth0
});

// POST: User login
app.post('/api/login', async (req, res) => {
    // Handle Auth0 authentication
});

// GET: Retrieve user events and friends' liked events
app.get('/api/user', async (req, res) => {
    // Fetch events from database and Seatgeek API
});

// GET: Retrieve specific user information
app.get('/api/user/:user_id', async (req, res) => {
    // Fetch user info from database
});

// POST: Add friend
app.post('/api/user/:user_id', async (req, res) => {
    // Add friend to user's friend list
});

// DELETE: Remove friend
app.delete('/api/user/:user_id', async (req, res) => {
    // Remove friend from user's list
});

// GET: Search for events
app.get('/api/user/search_events', async (req, res) => {
    // Query Seatgeek API with input parameters
});

// POST: Create a new event
app.post('/api/user/new_event', async (req, res) => {
    // Save new event to database
});

// PUT: Edit an existing event
app.put('/api/user/edit_event/:event_id', async (req, res) => {
    // Update event in the database
});

// DELETE: Remove event
app.delete('/api/user/:event_id', async (req, res) => {
    // Delete event from database
});

// GET: Retrieve chat messages (Chat history)
app.get('/api/user/chat', async (req, res) => {
    // Retrieve chat history between users
});

// POST: Send a new chat message (Real-time chat)
app.post('/api/user/chat', async (req, res) => {
    // Send a new chat message using Socket.IO
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
