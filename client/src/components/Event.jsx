// Event Feed Component

// Props:
// - events (array of event objects)

// Functions:
// - handleLike: POST to like an event
// - handleDelete: DELETE to remove an event

function EventFeed({ events }) {
    const handleLike = async (eventId) => {
      // POST to like an event
    };

    const handleDelete = async (eventId) => {
      // DELETE event from database
    };

    return (
      <div>
        {events.map((event) => (
          <div key={event.event_id}>
            <h3>{event.artist}</h3>
            <p>{event.venue_name}</p>
            <button onClick={() => handleLike(event.event_id)}>Like</button>
            <button onClick={() => handleDelete(event.event_id)}>Delete</button>
          </div>
        ))}
      </div>
    );
  }

  export default EventFeed;
