// Event Feed Component

// Props:
// - userEvents (array of event objects): List of events created by the user
// - likedEvents (array of event objects): List of events liked by the user
// - onUpdate (function): Callback to refresh the event feed after any action

// Functions:
// - handleLikeEvent: Adds an event to the user's liked events
// - handleDeleteEvent: Deletes an event from the user's created events
// - handleEditEvent: Edits the user's created events
// - handleAddEvent: Creates a new event for the user

import { useState } from 'react';

function Event({ userEvents, likedEvents, onUpdate }) {
    const [error, setError] = useState(null); // Error state for displaying error messages

    // Retrieve JWT token from local storage for authenticated requests
    const getAuthToken = () => localStorage.getItem('token');

    // Function to handle liking an event
    const handleLikeEvent = async (eventId) => {
        try {
            const response = await fetch(`/api/user/like_event/${eventId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            if (!response.ok) throw new Error('Failed to like event');
            onUpdate(); // Refresh the event feed after liking
        } catch (err) {
            setError('Error liking event');
            console.error('Error liking event:', err);
        }
    };

    // Function to handle deleting an event
    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(`/api/user/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            if (!response.ok) throw new Error('Failed to delete event');
            onUpdate(); // Refresh the event feed after deletion
        } catch (err) {
            setError('Error deleting event');
            console.error('Error deleting event:', err);
        }
    };

    // Function to handle editing an event
    const handleEditEvent = async (eventId) => {
        try {
            // Define updated event data
            const updatedEventData = {
                date: '2023-12-31',
                artist: 'Updated Artist',
                venue_name: 'Updated Venue',
                venue_address: '123 Updated Street',
                time: '20:00',
                cost: 50,
            };

            const response = await fetch(`/api/user/edit_event/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
                body: JSON.stringify(updatedEventData),
            });

            if (!response.ok) throw new Error('Failed to edit event');
            onUpdate(); // Refresh the event feed after edit
        } catch (err) {
            setError('Error editing event');
            console.error('Error editing event:', err);
        }
    };

    // Function to handle adding a new event
    const handleAddEvent = async () => {
        try {
            // Define new event data
            const newEventData = {
                date: '2023-12-31',
                artist: 'New Artist',
                venue_name: 'New Venue',
                venue_address: '456 Example Ave',
                time: '19:00',
                cost: 40,
            };

            const response = await fetch('/api/user/new_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
                body: JSON.stringify(newEventData),
            });

            if (!response.ok) throw new Error('Failed to create event');
            onUpdate(); // Refresh the event feed after adding a new event
        } catch (err) {
            setError('Error adding event');
            console.error('Error adding event:', err);
        }
    };

    return (
        <div>
            {/* Display error message if there is an error */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Render the list of events created by the user */}
            <h2>Your Events</h2>
            {userEvents.map((event) => (
                <div key={event.event_id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h3>{event.artist}</h3>
                    <p>Venue: {event.venue_name}</p>
                    <p>Date: {event.date}</p>
                    <p>Time: {event.time}</p>
                    <p>Cost: ${event.cost}</p>

                    {/* Action buttons for user's created events */}
                    <button onClick={() => handleDeleteEvent(event.event_id)}>Delete</button>
                    <button onClick={() => handleEditEvent(event.event_id)}>Edit</button>
                </div>
            ))}

            {/* Render the list of events liked by the user */}
            <h2>Liked Events</h2>
            {likedEvents.map((event) => (
                <div key={event.event_id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                    <h3>{event.artist}</h3>
                    <p>Venue: {event.venue_name}</p>
                    <p>Date: {event.date}</p>
                    <p>Time: {event.time}</p>
                    <p>Cost: ${event.cost}</p>

                    {/* Action button for liked events */}
                    <button onClick={() => handleLikeEvent(event.event_id)}>Unlike</button>
                </div>
            ))}

            {/* Add New Event button */}
            <button onClick={handleAddEvent}>Add New Event</button>
        </div>
    );
}

export default Event;
