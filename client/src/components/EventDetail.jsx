import React, { useState } from 'react';

const EventDetail = ({ event, isUserEvent, onLike, onRemove, onEdit, onDelete, onClose, onAuthError }) => {
    // State for handling error messages, initialized to null
    const [error, setError] = useState(null);

    /**
     * Retrieves the JWT token from localStorage.
     * If no token is found, calls onAuthError to prompt re-authentication.
     * @returns {string|null} - The JWT token or null if not found
     */
    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token && onAuthError) onAuthError();
        return token;
    };

    /**
     * Handles liking the event by calling the onLike function with the token.
     * If an error occurs, updates the error state with an appropriate message.
     */
    const handleLike = async () => {
        const token = getToken();
        if (!token) return;

        try {
            await onLike(event.event_id, token); // Calls onLike with event's ID and token
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Error liking event'); // Sets error state for UI display
            console.error(err); // Logs error for debugging
        }
    };

    /**
     * Handles removing the event from liked events by calling the onRemove function with the token.
     * If an error occurs, updates the error state with an appropriate message.
     */
    const handleRemove = async () => {
        const token = getToken();
        if (!token) return;

        try {
            await onRemove(event.event_id, token); // Calls onRemove with event's ID and token
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Error removing event from liked events'); // Sets error state for UI display
            console.error(err); // Logs error for debugging
        }
    };

    /**
     * Initiates editing the event by calling the onEdit function.
     * Passes the event object and token for editing.
     */
    const handleEdit = () => {
        const token = getToken();
        if (!token) return;

        onEdit(event, token); // Passes the entire event object and token for editing
    };

    /**
     * Handles deleting the event by calling the onDelete function with the token.
     * If an error occurs, updates the error state with an appropriate message.
     */
    const handleDelete = async () => {
        const token = getToken();
        if (!token) return;

        try {
            await onDelete(event.event_id, token); // Calls onDelete with event's ID and token
            setError(null); // Clear previous errors
        } catch (err) {
            setError('Error deleting event'); // Sets error state for UI display
            console.error(err); // Logs error for debugging
        }
    };

    return (
        <div className="event-detail">
            {/* Back button to return to the previous view */}
            <button onClick={onClose} className="close-btn">Back to Events</button>

            {/* Event Title and Flier Image */}
            <h2>{event.event_name}</h2>
            <img src={event.flier_image} alt={event.event_name} className="event-flier" />

            {/* Event Information Section */}
            <div className="event-info">
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Venue:</strong> {event.venue_name}</p>
                <p><strong>Address:</strong> {event.venue_address}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Cost:</strong> ${event.cost}</p>
            </div>

            {/* Display error message if any actions fail */}
            {error && <p className="error-message">{error}</p>}

            {/* Event Actions Section */}
            <div className="event-actions">
                {isUserEvent ? (
                    <>
                        {/* Edit and Delete options available only for user-created events */}
                        <button onClick={handleEdit} className="edit-btn">Edit Event</button>
                        <button onClick={handleDelete} className="delete-btn">Delete Event</button>
                    </>
                ) : (
                    // Show "Like" or "Remove from Liked Events" based on whether the event is already liked
                    event.isLiked ? (
                        <button onClick={handleRemove} className="remove-like-btn">Remove from Liked Events</button>
                    ) : (
                        <button onClick={handleLike} className="like-btn">Like Event</button>
                    )
                )}
            </div>
        </div>
    );
};

export default EventDetail;
