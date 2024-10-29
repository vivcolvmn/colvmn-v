// Profile Component

// State:
// - userProfile, userEvents, errorMessage, successMessage

// Functions:
// - fetchUserProfile: GET request to fetch user info
// - fetchUserEvents: GET request to fetch user-created and liked events
// - handleEditProfile: POST to update profile settings

import { useState, useEffect } from 'react';
import Event from './Event'; // Reusable Event component

function Profile() {
    // State to store the user's profile information
    const [userProfile, setUserProfile] = useState({});

    // State to store the combined list of events created and liked by the user
    const [eventsFeed, setEventsFeed] = useState([]);

    // State to manage error and success messages
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Retrieve JWT token from local storage for authenticated requests
    const getAuthToken = () => localStorage.getItem('token');

    // Fetch user profile and events when the component mounts
    useEffect(() => {
        fetchUserProfile();
        fetchUserEvents();
    }, []);

    // Function to fetch the user's profile information from the backend API
    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`/api/user/${userProfile.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            if (!response.ok) throw new Error('Failed to fetch user profile');

            // Update state with user profile data
            setUserProfile(await response.json());
            setErrorMessage(''); // Clear error message on successful fetch
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setErrorMessage('Could not fetch profile. Please try again.');
        }
    };

    // Function to fetch events created and liked by the user from the backend API
    const fetchUserEvents = async () => {
        try {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            if (!response.ok) throw new Error('Failed to fetch user events');

            const data = await response.json();

            // Combine created and liked events, and sort by date
            const combinedEvents = [...data.userEvents, ...data.likedEvents].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );

            // Update the eventsFeed state with the sorted list
            setEventsFeed(combinedEvents);
            setErrorMessage(''); // Clear error message on successful fetch
        } catch (err) {
            console.error('Error fetching user events:', err);
            setErrorMessage('Could not fetch events. Please try again.');
        }
    };

    // Function to handle profile editing
    const handleEditProfile = async (newProfileData) => {
        try {
            const response = await fetch(`/api/user/${userProfile.user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
                body: JSON.stringify(newProfileData),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            // Success message and refresh of profile data
            setSuccessMessage('Profile updated successfully');
            fetchUserProfile(); // Refresh profile data after update
            setErrorMessage(''); // Clear error message on successful update
        } catch (err) {
            console.error('Error updating profile:', err);
            setErrorMessage('Error updating profile. Please try again.');
            setSuccessMessage(''); // Clear success message on failure
        }
    };

    return (
        <div>
            <h1>{userProfile.username}'s Profile</h1>

            {/* Display error and success messages */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            {/* Display user's profile information */}
            {userProfile.profilePicture && <img src={userProfile.profilePicture} alt="Profile" />}
            <p>Member Since: {userProfile.joinDate}</p>
            <p>Quote: "{userProfile.quote}"</p>
            <p>Bio: {userProfile.bio}</p>

            {/* Form for editing profile */}
            <form onSubmit={(e) => {
                e.preventDefault();
                handleEditProfile({ username: e.target.username.value });
            }}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        defaultValue={userProfile.username}
                        placeholder="Enter new username"
                    />
                </label>
                <button type="submit">Save Changes</button>
            </form>

            {/* Display combined events feed */}
            <div>
                <h2>Your Events</h2>
                {eventsFeed.length > 0 ? (
                    <ul>
                        {eventsFeed.map((event) => (
                            <li key={event.event_id}>
                                <Event event={event} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
