// Home Page Component
//Displays user profile info, event feed, and friends list

// State:
// - userEvents, friendEvents

// Functions:
// - fetchUserEvents: GET request to fetch user's liked/created events
// - fetchFriendEvents: GET request to fetch friends' events

import { useState, useEffect } from 'react';
import Event from './Event'; // Component for the entire event feed
import FriendsList from './FriendsList'; // Component for friends list

function HomePage() {
    // State to store the user's profile information
    const [userProfile, setUserProfile] = useState({});

    // State to manage error messages
    const [errorMessage, setErrorMessage] = useState('');

    // Retrieve JWT token from local storage for authenticated requests
    const getAuthToken = () => localStorage.getItem('token');

    // Fetch user profile data when the component mounts
    useEffect(() => {
        fetchUserProfile();
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

    return (
        <div>
            <h1>Home</h1>

            {/* Display error message if present */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Render user's profile information */}
            <div>
                {userProfile.profilePicture && (
                    <img src={userProfile.profilePicture} alt="Profile" />
                )}
                <p>Member Since: {userProfile.joinDate}</p>
                <p>Quote: "{userProfile.quote}"</p>
                <p>Bio: {userProfile.bio}</p>
            </div>

            {/* Render the entire event feed */}
            <div>
                <h2>Your Event Feed</h2>
                <Event userEvents={[]} likedEvents={[]} onUpdate={null}/>
            </div>

            {/* Render friends list */}
            <div>
                <h2>Friends</h2>
                <FriendsList />
            </div>
        </div>
    );
}

export default HomePage;
