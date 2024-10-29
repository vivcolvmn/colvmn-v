// Search Events Component

// State:
// - searchTerm, searchResults

// Functions:
// - handleSearch: GET request to API for event search

import { useState } from 'react';

function SearchEvents() {
    // State to store the search term input by the user
    const [searchTerm, setSearchTerm] = useState('');

    // State to store the list of search results returned by the API
    const [searchResults, setSearchResults] = useState([]);

    // State to store any error that may occur during the search
    const [error, setError] = useState(null);

    // Retrieve JWT token from local storage for authenticated requests
    const getAuthToken = () => localStorage.getItem('token');

    // Function to handle searching events using the SeatGeek API
    const handleSearch = async () => {
        // Check if searchTerm is empty or only contains spaces; if so, do nothing
        if (!searchTerm.trim()) return;

        try {
            // Perform a GET request to the backend API with the search term
            const response = await fetch(`/api/user/search_events?query=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            // Check if the response was successful
            if (!response.ok) throw new Error('Failed to fetch search results');

            // Parse JSON data from the response
            const data = await response.json();

            // Update state with the list of search results
            setSearchResults(data.seatGeekEvents);
            setError(null); // Clear any previous error message on successful fetch
        } catch (err) {
            // If an error occurs, store it in the error state
            setError('Error fetching search results');
            console.error('Error fetching search results:', err);
        }
    };

    return (
        <div>
            {/* Input field for the user to enter a search term */}
            <input
                type="text"
                value={searchTerm}
                placeholder="Search for events"
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Button to initiate the search */}
            <button onClick={handleSearch}>Search</button>

            {/* Display error message if there is an error */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Render search results */}
            <div>
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map((event) => (
                            <li key={event.id} style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                                <h3>{event.title}</h3>
                                <p>Venue: {event.venue.name}, {event.venue.city}</p>
                                <p>Date: {event.datetime_local}</p>
                                <a href={event.url} target="_blank" rel="noopener noreferrer">
                                    View Event
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
}

export default SearchEvents;
