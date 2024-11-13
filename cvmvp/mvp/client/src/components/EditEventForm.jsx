import React, { useState } from 'react';

const EditEventForm = ({ event, onUpdateEvent, onCancel }) => {
  const [formData, setFormData] = useState({
    date: event.date,
    time: event.time,
    ticketPrice: event.ticketprice,
    bandName: event.bandname,
    venueName: event.venuename,
    venueAddress: event.venueaddress,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateEvent({ ...event, ...formData });
  };

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="date" placeholder="Date" value={formData.date} onChange={handleInputChange} required />
        <input type="text" name="time" placeholder="Time" value={formData.time} onChange={handleInputChange} required />
        <input type="text" name="ticketPrice" placeholder="Ticket Price" value={formData.ticketPrice} onChange={handleInputChange} required />
        <input type="text" name="bandName" placeholder="Band Name" value={formData.bandName} onChange={handleInputChange} required />
        <input type="text" name="venueName" placeholder="Venue Name" value={formData.venueName} onChange={handleInputChange} required />
        <input type="text" name="venueAddress" placeholder="Venue Address" value={formData.venueAddress} onChange={handleInputChange} required />
        <button type="submit">Update Event</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditEventForm;
