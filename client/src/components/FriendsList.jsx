import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import SearchProfile from './SearchProfile';

const FriendsList = ({ onAuthError }) => {
    const [friends, setFriends] = useState([]); // Stores the list of user's friends
    const [view, setView] = useState('list'); // Tracks current view: 'list' or 'profile' or 'search'
    const [selectedFriendId, setSelectedFriendId] = useState(null); // Stores ID of selected friend for Profile view
    const [error, setError] = useState(null); // Error state for handling issues in data fetching

    /**
     * Fetches the list of friends for the logged-in user when component mounts.
     * Uses the JWT stored in localStorage for authenticated requests.
     */
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Authentication token not found');

                // Fetch friends list from the server
                const response = await fetch('/api/user/friends', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem('token'); // Clear token if unauthorized
                    if (onAuthError) onAuthError(); // Notify parent component of auth error
                    throw new Error('Session expired. Please log in again.');
                }

                if (!response.ok) throw new Error('Error fetching friends');

                const data = await response.json();
                setFriends(data.friends); // Set friends state with the list of friends
                setError(null); // Clear any previous errors
            } catch (err) {
                setError(err.message || 'Failed to load friends'); // Set error message on fetch failure
                console.error(err);
            }
        };

        fetchFriends();
    }, [onAuthError]);

    /**
     * Handles opening a selected friend's profile.
     * @param {string} friendId - ID of the friend to display in the Profile view
     */
    const handleFriendSelect = (friendId) => {
        setSelectedFriendId(friendId);
        setView('profile'); // Switch to profile view for the selected friend
    };

    /**
     * Closes the Profile or Search view and returns to the friends list.
     */
    const handleClose = () => {
        setSelectedFriendId(null);
        setView('list'); // Return to friends list view
    };

    return (
        <div className="friends-list">
            {view === 'search' && (
                <SearchProfile onProfileSelect={handleFriendSelect} />
            )}

            {view === 'profile' && selectedFriendId && (
                <Profile userId={selectedFriendId} onClose={handleClose} />
            )}

            {view === 'list' && (
                <>
                    <div className="search-bar">
                        <button onClick={() => setView('search')} className="search-profile-btn">Search Users</button>
                    </div>

                    <h2>Your Friends</h2>
                    {error && <p className="error-message">{error}</p>}

                    <ul className="friends-list-items">
                        {friends.map((friend) => (
                            <li key={friend.user_id} className="friend-item">
                                <img src={friend.profile_picture} alt={`${friend.username}'s profile`} className="friend-profile-picture"/>
                                <span onClick={() => handleFriendSelect(friend.user_id)} className="friend-username">
                                    {friend.username}
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default FriendsList;
