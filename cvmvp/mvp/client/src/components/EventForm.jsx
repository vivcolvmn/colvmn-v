import React, { useState } from 'react';

const EventForm = ({ onAddEvent }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    ticketPrice: '',
    bandName: '',
    venueName: '',
    venueAddress: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(formData);
    setFormData({
      date: '',
      time: '',
      ticketPrice: '',
      bandName: '',
      venueName: '',
      venueAddress: '',
    });
    setShowForm(false);
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Hide Form' : 'Add New Event'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="date" placeholder="Date" value={formData.date} onChange={handleInputChange} required />
          <input type="text" name="time" placeholder="Time" value={formData.time} onChange={handleInputChange} required />
          <input type="text" name="ticketPrice" placeholder="Ticket Price" value={formData.ticketPrice} onChange={handleInputChange} required />
          <input type="text" name="bandName" placeholder="Band Name" value={formData.bandName} onChange={handleInputChange} required />
          <input type="text" name="venueName" placeholder="Venue Name" value={formData.venueName} onChange={handleInputChange} required />
          <input type="text" name="venueAddress" placeholder="Venue Address" value={formData.venueAddress} onChange={handleInputChange} required />
          <button type="submit">Add Event</button>
        </form>
      )}
    </div>
  );
};

export default EventForm;
