import pkg from 'pg'; // Use default import from 'pg'
import { eventData } from './eventData.js'; // Adjust the path if necessary

const { Pool } = pkg; // Destructure Pool from the imported 'pg' package

const pool = new Pool({
  user: 'vivcolvmn',
  host: 'localhost',
  database: 'event_management',
  password: 'iloveyou4ever',
  port: 5432,
});

const insertEvents = async () => {
  try {
    for (const event of eventData) {
      const { date, time, ticketPrice, band, venue } = event;
      const bandName = band.name;
      const venueName = venue.name;
      const venueAddress = venue.address;

      await pool.query(
        'INSERT INTO events (date, time, ticketPrice, bandName, venueName, venueAddress) VALUES ($1, $2, $3, $4, $5, $6)',
        [date, time, ticketPrice, bandName, venueName, venueAddress]
      );
    }
    console.log('All events have been inserted into the database.');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    pool.end();
  }
};

insertEvents();
