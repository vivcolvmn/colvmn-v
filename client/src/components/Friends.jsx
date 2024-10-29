// Friends List Component

// State:
// - friendsList

// Functions:
// - fetchFriendsList: GET request to retrieve friends
// - handleAddFriend: POST request to add a friend
// - handleRemoveFriend: DELETE request to remove a friend

import { useState, useEffect } from 'react';

function FriendsList() {
    // State to store the list of friends
    const [friendsList, setFriendsList] = useState([]);

    // State to store any error that may occur during data fetching or actions
    const [error, setError] = useState(null);

    // Retrieve JWT token from local storage for authenticated requests
    const getAuthToken = () => localStorage.getItem('token');

    // Fetch the friends list when the component mounts
    useEffect(() => {
        fetchFriendsList();
    }, []);

    // Function to fetch friends from the backend API
    const fetchFriendsList = async () => {
        try {
            // GET request to retrieve friends list
            const response = await fetch('/api/user/friends', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            // Check if the response was successful
            if (!response.ok) throw new Error('Failed to fetch friends list');

            // Parse JSON data from the response
            const data = await response.json();

            // Update state with the fetched friends list
            setFriendsList(data.friends);
            setError(null); // Clear any previous error message on successful fetch
        } catch (err) {
            // If an error occurs, store it in the error state
            setError('Error fetching friends list');
            console.error('Error fetching friends list:', err);
        }
    };

    // Function to add a friend by making a POST request
    const handleAddFriend = async (friendId) => {
        try {
            const response = await fetch(`/api/user/${friendId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            // Check if the request was successful
            if (!response.ok) throw new Error('Failed to add friend');

            // Refresh the friends list after successfully adding a friend
            fetchFriendsList();
            setError(null); // Clear any previous error message on successful add
        } catch (err) {
            // If an error occurs, store it in the error state
            setError('Error adding friend');
            console.error('Error adding friend:', err);
        }
    };

    // Function to remove a friend by making a DELETE request
    const handleRemoveFriend = async (friendId) => {
        try {
            const response = await fetch(`/api/user/${friendId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`, // Include JWT token in headers
                },
            });

            // Check if the request was successful
            if (!response.ok) throw new Error('Failed to remove friend');

            // Refresh the friends list after successfully removing a friend
            fetchFriendsList();
            setError(null); // Clear any previous error message on successful remove
        } catch (err) {
            // If an error occurs, store it in the error state
            setError('Error removing friend');
            console.error('Error removing friend:', err);
        }
    };

    return (
        <div>
            <h2>Friends</h2>

            {/* Display error message if there is an error */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Render the friends list */}
            {friendsList.length > 0 ? (
                <ul>
                    {friendsList.map((friend) => (
                        <li key={friend.user_id}>
                            <p>{friend.username}</p>
                            <button onClick={() => handleRemoveFriend(friend.user_id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No friends found</p>
            )}

            {/* Example add friend button (replace with actual friend ID input) */}
            <button onClick={() => handleAddFriend('newFriendId')}>Add Friend</button>
        </div>
    );
}

export default FriendsList;
