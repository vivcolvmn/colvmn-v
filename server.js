import express from 'express';
import pkg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';


dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secret key for signing JWT tokens; keep this secure in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
    // Extract token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Format should be "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Verify the token with JWT_SECRET
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is not valid' });
        req.user = user; // Attach decoded user information to request object
        next();
    });
}

// GET: Retrieve user events and friends' liked events
// Fetches the events created by the user, events liked by the user, and events liked by the user's friends
app.get('/api/user', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT

    try {
        // Fetch events created by the user
        const userEvents = await pool.query(
            'SELECT * FROM events WHERE event_id = ANY((SELECT created_events FROM users WHERE user_id = $1)::int[])',
            [userId]
        );

        // Fetch events liked by the user
        const likedEvents = await pool.query(
            'SELECT * FROM events WHERE event_id = ANY((SELECT liked_events FROM users WHERE user_id = $1)::int[])',
            [userId]
        );

        // Fetch events liked by friends
        const friendsEvents = await pool.query(
            'SELECT * FROM events WHERE event_id = ANY(' +
            'SELECT unnest(liked_events) FROM users WHERE user_id IN (' +
            'SELECT friend_id FROM friends WHERE user_id = $1))',
            [userId]
        );

        // Return events data in JSON format
        res.status(200).json({
            userEvents: userEvents.rows,
            likedEvents: likedEvents.rows,
            friendsEvents: friendsEvents.rows,
        });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET: Retrieve specific user information
// Fetches information for a specific user by user_id parameter
app.get('/api/user/:user_id', async (req, res) => {
    const { user_id } = req.params; // Extract user ID from URL parameters
    try {
        // Query the database for user info
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET: Search for events using SeatGeek API and include user's liked events from the database
app.get('/api/user/search_events', authenticateToken, async (req, res) => {
    const { query } = req.query; // Extract search query
    const userId = req.user.id; // Extract user ID from JWT

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // Build SeatGeek API URL with query parameters
        const url = `https://api.seatgeek.com/2/events?q=${encodeURIComponent(query)}&client_id=${process.env.SEATGEEK_CLIENT_ID}&client_secret=${process.env.SEATGEEK_CLIENT_SECRET}`;

        // Fetch events from SeatGeek API
        const response = await fetch(url);
        if (!response.ok) throw new Error(`SeatGeek API error: ${response.statusText}`);

        const data = await response.json();
        const seatGeekEvents = data.events.map(event => ({
            id: event.id,
            title: event.title,
            datetime_local: event.datetime_local,
            venue: {
                name: event.venue.name,
                city: event.venue.city,
                state: event.venue.state,
                address: event.venue.address,
            },
            performers: event.performers.map(performer => performer.name),
            url: event.url,
        }));

        // Fetch liked events from the database for the current user
        const likedEventsResult = await pool.query(
            'SELECT * FROM events WHERE event_id = ANY((SELECT liked_events FROM users WHERE user_id = $1)::int[])',
            [userId]
        );

        // Return combined SeatGeek events and liked events
        res.status(200).json({ seatGeekEvents, likedEvents: likedEventsResult.rows });
    } catch (err) {
        console.error('Error fetching events from SeatGeek:', err);
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// POST: Register new user
// Registers a new user by storing hashed password in the database
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        // Insert new user into the database
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST: User login
// Authenticates a user by verifying password and returns a JWT token on success
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = result.rows[0];

        // Compare provided password with stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate JWT token for authenticated user
        const token = jwt.sign({ id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST: Add friend
// Adds a friend relationship between the authenticated user and specified friend ID
app.post('/api/user/:user_id', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT
    const { user_id: friendId } = req.params;

    try {
        const result = await pool.query(
            'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2) RETURNING *',
            [userId, friendId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding friend:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST: Create a new event
// Allows authenticated users to create a new event and adds it to their created events list
app.post('/api/user/new_event', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT
    const { date, artist, venue_name, venue_address, time, cost } = req.body;

    try {
        // Insert new event and return the event ID
        const result = await pool.query(
            'INSERT INTO events (date, artist, venue_name, venue_address, time, cost) VALUES ($1, $2, $3, $4, $5, $6) RETURNING event_id',
            [date, artist, venue_name, venue_address, time, cost]
        );

        const eventId = result.rows[0].event_id;

        // Update user's created_events array to include the new event ID
        await pool.query(
            'UPDATE users SET created_events = array_append(created_events, $1) WHERE user_id = $2',
            [eventId, userId]
        );

        res.status(201).json({ message: 'Event created', event_id: eventId });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST: Like an event
// Allows authenticated user to like an event, updating their liked events list
app.post('/api/user/like_event/:event_id', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT
    const { event_id } = req.params;

    try {
        // Use array_append to add the event ID to the liked_events array if not already present
        const result = await pool.query(
            'UPDATE users SET liked_events = array_append(liked_events, $1) ' +
            'WHERE user_id = $2 AND NOT $1 = ANY(liked_events) RETURNING liked_events',
            [event_id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Event could not be liked or already liked' });
        }

        res.status(200).json({ message: 'Event liked', liked_events: result.rows[0].liked_events });
    } catch (err) {
        console.error('Error liking event:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET: Search for a profile by username
// Allows users to search for profiles by username and returns matching user details
app.get('/api/user/search', authenticateToken, async (req, res) => {
    const { username } = req.query; // Extract username from query parameters

    if (!username) {
        return res.status(400).json({ error: 'Username query parameter is required' });
    }

    try {
        // Query the database for users whose username matches the query
        const result = await pool.query(
            'SELECT user_id, username, profile_picture, member_since, quote, bio FROM users WHERE username ILIKE $1 LIMIT 10',
            [`%${username}%`]
        );

        // Check if any users matched the search
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No matching users found' });
        }

        // Return list of matching users
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error searching for users by username:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// DELETE: Remove friend
// Removes a friend relationship between the authenticated user and specified friend ID
app.delete('/api/user/:user_id', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extract user ID from JWT
    const { user_id: friendId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM friends WHERE user_id = $1 AND friend_id = $2 RETURNING *',
            [userId, friendId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Friendship not found' });
        }
        res.status(200).json({ message: 'Friend removed' });
    } catch (err) {
        console.error('Error removing friend:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE: Remove event
// Deletes an event and removes it from all users' liked and created events arrays
app.delete('/api/user/:event_id', authenticateToken, async (req, res) => {
    const { event_id } = req.params;

    try {
        // Start transaction
        await pool.query('BEGIN');

        // Delete the event from events table
        const deleteEventResult = await pool.query(
            'DELETE FROM events WHERE event_id = $1 RETURNING *',
            [event_id]
        );

        if (deleteEventResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ message: 'Event not found' });
        }

        // Remove event from users' liked_events and created_events arrays
        await pool.query(
            'UPDATE users SET liked_events = array_remove(liked_events, $1), created_events = array_remove(created_events, $1)',
            [event_id]
        );

        // Commit transaction
        await pool.query('COMMIT');
        res.status(200).json({ message: 'Event deleted' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT: Edit an existing event
// Allows authenticated user to update event details
app.put('/api/user/edit_event/:event_id', authenticateToken, async (req, res) => {
    const { event_id } = req.params;
    const { date, artist, venue_name, venue_address, time, cost } = req.body;

    try {
        // Update event details in the events table
        const result = await pool.query(
            'UPDATE events SET date = $1, artist = $2, venue_name = $3, venue_address = $4, time = $5, cost = $6 WHERE event_id = $7 RETURNING *',
            [date, artist, venue_name, venue_address, time, cost, event_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PROD: Construct path to build folder in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PROD: Serve static build files from React (Place this after initializing the app, before the wildcard catch-all)
app.use(express.static(path.join(__dirname, '../colvmn-v/client/dist')));

// PROD: Ensure all routes are served the index.html file to allow React to manage routing (should be the last defined route)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../colvmn-v/client/dist/index.html'), (err) => {
      if (err) {
        console.error("Error serving index.html:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  });


// Server listening on specified PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
