import React, { useState } from 'react';
import EventDetail from './EventDetail'; // Importing EventDetail for viewing specific event details

const SearchEvents = ({ onAuthError }) => {
    const [searchCriteria, setSearchCriteria] = useState({
        date: '',
        eventName: '',
        venueName: '',
        createdBy: '',
    });
    const [searchResults, setSearchResults] = useState([]); // Stores list of events from the search
    const [selectedEvent, setSelectedEvent] = useState(null); // Stores the event selected for detailed view
    const [error, setError] = useState(null); // Error state for handling issues in search

    /**
     * Updates search criteria state as the user types in the search form.
     * @param {object} e - Event object from input change
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria((prevCriteria) => ({
            ...prevCriteria,
            [name]: value,
        }));
    };

    /**
     * Initiates the search based on filled search criteria fields.
     * Constructs a query string dynamically and fetches matching events from the server.
     * @param {object} e - Event object from form submission
     */
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            // Build query parameters from the populated search criteria fields
            const queryParams = new URLSearchParams();
            Object.entries(searchCriteria).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            // Fetch matching events from the backend using the constructed query parameters
            const response = await fetch(`/api/user/search_events?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                localStorage.removeItem('token'); // Clear token if unauthorized
                if (onAuthError) onAuthError(); // Notify parent component of auth error
                throw new Error('Session expired. Please log in again.');
            }

            if (!response.ok) throw new Error('Error fetching search results');

            const data = await response.json();
            setSearchResults(data.seatGeekEvents); // Update search results state with data
            setError(null); // Clear any previous error
        } catch (err) {
            setError(err.message || 'Failed to fetch search results'); // Update error state if fetch fails
            setSearchResults([]); // Clear results on error
            console.error(err);
        }
    };

    /**
     * Handles displaying event details by setting selectedEvent state.
     * @param {object} event - Event object from the search result
     */
    const handleEventSelect = (event) => {
        setSelectedEvent(event); // Set selected event to display EventDetail
    };

    /**
     * Resets selectedEvent to null to return to the search results list.
     */
    const handleCloseDetails = () => {
        setSelectedEvent(null); // Clear selected event to return to the search results view
    };

    return (
        <div className="search-events">
            {selectedEvent ? (
                // Display EventDetail component if an event is selected
                <EventDetail
                    event={selectedEvent}
                    onClose={handleCloseDetails}
                />
            ) : (
                // Display search form and search results if no event is selected
                <>
                    <form onSubmit={handleSearch} className="search-form">
                        <label>
                            Date:
                            <input
                                type="date"
                                name="date"
                                value={searchCriteria.date}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Event Name:
                            <input
                                type="text"
                                name="eventName"
                                value={searchCriteria.eventName}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Venue Name:
                            <input
                                type="text"
                                name="venueName"
                                value={searchCriteria.venueName}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Created By:
                            <input
                                type="text"
                                name="createdBy"
                                value={searchCriteria.createdBy}
                                onChange={handleInputChange}
                            />
                        </label>
                        <button type="submit" className="search-button">Search</button>
                    </form>

                    {error && <p className="error-message">{error}</p>}

                    {/* Display list of search results */}
                    <ul className="search-results">
                        {searchResults.map((event) => (
                            <li key={event.id} className="search-result-item">
                                <span className="event-date">{new Date(event.datetime_local).toLocaleDateString()}</span>
                                <span className="event-name">{event.title}</span>
                                <span className="event-venue">{event.venue.name}</span>
                                <a href="#" onClick={() => handleEventSelect(event)} className="view-details-link">View Details</a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SearchEvents;
