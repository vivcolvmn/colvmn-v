import React, { useState } from 'react';

const EventList = ({ events, onEdit, onDelete, onLike }) => {
  const [showDetails, setShowDetails] = useState({});

  const handleShowDetails = (id) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>
          <p>{event.date}</p>
          <p>
            {/* Add checks to ensure bandName and venueName are defined */}
            {event.bandname ? event.bandname : 'Unknown Band'} at {event.venuename ? event.venuename : 'Unknown Venue'}
          </p>
          <button onClick={() => handleShowDetails(event.id)}>
            {showDetails[event.id] ? 'Hide Details' : 'Show Details'}
          </button>

          {showDetails[event.id] && (
            <div>
              <p>Time: {event.time}</p>
              <p>Ticket Price: {event.ticketprice}</p>
              <p>Venue Address: {event.venueaddress ? event.venueaddress : 'No Address Available'}</p>
              <button onClick={() => onEdit(event)}>Edit</button>
              <button onClick={() => onDelete(event.id)}>Delete</button>
              <button onClick={() => onLike(event)}>
                Like
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default EventList;
