import React, { useState, useEffect } from 'react';
import SearchEvents from './SearchEvents';
import CreateEvent from './CreateEvent';
import EventDetail from './EventDetail';

const Events = ({ onAuthError }) => {
    const [events, setEvents] = useState([]); // Stores list of events for the main feed
    const [view, setView] = useState('feed'); // Tracks current view: 'feed', 'search', 'create', or 'details'
    const [selectedEvent, setSelectedEvent] = useState(null); // Stores the selected event for EventDetail view
    const [error, setError] = useState(null); // Error state for handling issues in data fetching

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
     * Fetches events created or liked by the user, as well as events liked or created by the user’s friends.
     * This function runs once when the component mounts.
     */
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = getToken();
                if (!token) return; // Exit if no token is available

                // Fetch events from the server
                const response = await fetch('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem('token'); // Clear token if unauthorized
                    if (onAuthError) onAuthError(); // Notify parent component of auth error
                    throw new Error('Session expired. Please log in again.');
                }

                if (!response.ok) throw new Error('Error fetching events');

                const data = await response.json();
                // Combine and sort events by date
                const allEvents = [...data.userEvents, ...data.likedEvents, ...data.friendsEvents];
                allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(allEvents); // Update events state with sorted list
                setError(null); // Clear any previous errors
            } catch (err) {
                setError(err.message || 'Failed to load events'); // Set error message on fetch failure
                console.error(err);
            }
        };

        fetchEvents();
    }, [onAuthError]);

    /**
     * Handles showing the EventDetail component for a selected event.
     * @param {object} event - The event to display in detail view
     */
    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        setView('details'); // Switch to details view
    };

    /**
     * Resets the view to show the main events feed.
     */
    const handleCloseDetails = () => {
        setSelectedEvent(null);
        setView('feed'); // Return to events feed view
    };

    /**
     * Renders different components based on the current view state.
     */
    return (
        <div className="events">
            <div className="events-header">
                <button onClick={() => setView('search')} className="search-events-btn">Search Events</button>
                <button onClick={() => setView('create')} className="create-event-btn">Create Event</button>
            </div>

            {view === 'search' && (
                <SearchEvents onEventSelect={handleEventSelect} onAuthError={onAuthError} />
            )}

            {view === 'create' && (
                <CreateEvent onEventCreated={() => setView('feed')} onAuthError={onAuthError} />
            )}

            {view === 'details' && selectedEvent && (
                <EventDetail event={selectedEvent} onClose={handleCloseDetails} onAuthError={onAuthError} />
            )}

            {view === 'feed' && (
                <>
                    <h2>Your Events Feed</h2>
                    {error && <p className="error-message">{error}</p>}

                    <ul className="event-list">
                        {events.map((event) => (
                            <li key={event.event_id} className="event-item">
                                <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                                <span className="event-name">{event.event_name}</span>
                                <span className="event-venue">{event.venue_name}</span>
                                <button onClick={() => handleEventSelect(event)} className="view-details-btn">View Details</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Events;
