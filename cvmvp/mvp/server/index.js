import express from 'express';
import cors from 'cors';
import pkg from 'pg'

const { Pool } = pkg;

const pool = new Pool({
  user: 'ENTER_YOUR_USERNAME_HERE',
  host: 'localhost',
  database: 'event_management',
  password: 'ENTER_YOUR_PASSWORD_HERE',
  port: 5432,
});

const app = express();
app.use(cors());
app.use(express.json());

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search for events by date, band, or venue
app.get("/api/events/search", async (req, res) => {
  const { date, band, venue } = req.query;

  try {
    let query = 'SELECT * FROM events WHERE 1=1';
    const queryParams = [];

    if (date) {
      queryParams.push(`%${date}%`);
      query += ` AND date ILIKE $${queryParams.length}`;
    }

    if (band) {
      queryParams.push(`%${band}%`);
      query += ` AND bandName ILIKE $${queryParams.length}`;
    }

    if (venue) {
      queryParams.push(`%${venue}%`);
      query += ` AND venueName ILIKE $${queryParams.length}`;
    }

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new event
app.post("/api/events", async (req, res) => {
  const { date, time, ticketPrice, bandName, venueName, venueAddress } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (date, time, ticketPrice, bandName, venueName, venueAddress) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [date, time, ticketPrice, bandName, venueName, venueAddress]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit an event by ID
app.put("/api/events/:id", async (req, res) => {
  const { id } = req.params;
  const { date, time, ticketPrice, bandName, venueName, venueAddress } = req.body;
  try {
    const result = await pool.query(
      'UPDATE events SET date = $1, time = $2, ticketPrice = $3, bandName = $4, venueName = $5, venueAddress = $6 WHERE id = $7 RETURNING *',
      [date, time, ticketPrice, bandName, venueName, venueAddress, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an event by ID
app.delete("/api/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
