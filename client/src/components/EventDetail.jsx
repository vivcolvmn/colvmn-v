// Event Detail Component

// Props:
// - eventId (ID of the event)

// State:
// - eventDetails (object containing event info)

// Functions:
// - fetchEventDetails: GET request to fetch detailed event info

import { useState, useEffect } from 'react';

function EventDetail({ eventId }) {
    // State to store the detailed event information
    const [eventDetails, setEventDetails] = useState(null);

    // State to store any error that may occur during data fetching
    const [error, setError] = useState(null);

    // Retrieve JWT token from local storage for authenticated requests
    const getAuthToken = () => localStorage.getItem('token');

    // useEffect to fetch event details when component mounts or when eventId changes
    useEffect(() => {
        fetchEventDetails(); // Call fetch function to load data
    }, [eventId]); // Re-run effect if eventId prop changes

    // Function to fetch event details from the backend API
    const fetchEventDetails = async () => {
        try {
            // Make a GET request to retrieve details of a specific event
            const response = await fetch(`/api/user/event/${eventId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            // Check if the response was successful
            if (!response.ok) throw new Error('Failed to fetch event details');

            // Parse JSON data from the response
            const data = await response.json();

            // Update state with the event details
            setEventDetails(data);
        } catch (err) {
            // If an error occurs, store it in the error state
            setError('Error fetching event details');
            console.error('Error fetching event details:', err);
        }
    };

    // If an error occurs, display the error message
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    // Show loading indicator while data is being fetched
    if (!eventDetails) return <div>Loading...</div>;

    // Render the event details once data is loaded
    return (
        <div>
            <h2>{eventDetails.artist}</h2>
            <p>Date: {eventDetails.date}</p>
            <p>Venue: {eventDetails.venue_name}</p>
            <p>Address: {eventDetails.venue_address}</p>
            <p>Time: {eventDetails.time}</p>
            <p>Cost: ${eventDetails.cost}</p>
        </div>
    );
}

export default EventDetail;
