import React, { useEffect, useState } from 'react';
import EventDetail from './EventDetail'; // Import the EventDetail component

const Profile = ({ userId, isCurrentUser, onEditProfile, onAddFriend, onRemoveFriend, onAuthError }) => {
    const [profile, setProfile] = useState(null);
    const [likedEvents, setLikedEvents] = useState([]);
    const [createdEvents, setCreatedEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null); // State for the currently selected event
    const [error, setError] = useState(null);

    /**
     * Fetches profile and event data for the user when component mounts.
     * Uses the JWT stored in localStorage for authenticated requests.
     */
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authentication token not found');
                }

                // Fetch profile information
                const profileResponse = await fetch(`/api/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (profileResponse.status === 401) throw new Error('Unauthorized');
                if (!profileResponse.ok) throw new Error('Failed to fetch profile data');

                const profileData = await profileResponse.json();
                setProfile(profileData);

                // Fetch user events (liked and created)
                const eventsResponse = await fetch(`/api/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (eventsResponse.status === 401) throw new Error('Unauthorized');
                if (!eventsResponse.ok) throw new Error('Failed to fetch events data');

                const eventsData = await eventsResponse.json();
                setLikedEvents(eventsData.likedEvents);
                setCreatedEvents(eventsData.userEvents);
            } catch (err) {
                console.error('Error loading profile data:', err);
                if (err.message === 'Unauthorized') {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('token'); // Clear invalid token
                    if (onAuthError) onAuthError(); // Notify parent of auth error
                } else {
                    setError('Error loading profile data');
                }
            }
        };

        fetchProfileData();
    }, [userId, onAuthError]);

    /**
     * Handles selecting an event to display its details.
     * Sets the selected event to show the EventDetail component.
     * @param {string} eventId - The ID of the selected event
     */
    const handleEventSelect = (eventId) => {
        const event = [...likedEvents, ...createdEvents].find(e => e.event_id === eventId);
        setSelectedEvent(event); // Set the selected event to show details
    };

    /**
     * Closes the EventDetail view and returns to the list of events.
     */
    const handleCloseDetails = () => {
        setSelectedEvent(null); // Reset selected event to null
    };

    if (error) return <p className="error-message">{error}</p>;
    if (!profile) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <div className="profile-details">
                <h2>{profile.username}</h2>
                <img src={profile.profile_picture} alt={`${profile.username}'s profile`} className="profile-picture"/>
                <div className="user-info">
                    <p className="member-since">Member since: {new Date(profile.member_since).toLocaleDateString()}</p>
                    <p className="quote">"{profile.quote}"</p>
                    <p className="bio">{profile.bio}</p>
                </div>

                {isCurrentUser ? (
                    <button onClick={onEditProfile} className="edit-profile-btn">Edit Profile</button>
                ) : (
                    profile.isFriend ? (
                        <button onClick={() => onRemoveFriend(userId)} className="remove-friend-btn">Remove Friend</button>
                    ) : (
                        <button onClick={() => onAddFriend(userId)} className="add-friend-btn">Add Friend</button>
                    )
                )}
            </div>

            <div className="events-section">
                {selectedEvent ? (
                    // Show EventDetail component when an event is selected
                    <EventDetail
                        event={selectedEvent}
                        onClose={handleCloseDetails}
                    />
                ) : (
                    // Show list of events when no event is selected
                    <>
                        <h3>Liked Events</h3>
                        <ul className="event-list">
                            {likedEvents.map(event => (
                                <li key={event.event_id} className="event-item">
                                    <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                                    <span className="event-name">{event.event_name}</span>
                                    <span className="event-location">{event.venue_name}</span>
                                    <a href="#" onClick={() => handleEventSelect(event.event_id)} className="view-details-link">View Details</a>
                                </li>
                            ))}
                        </ul>

                        <h3>Created Events</h3>
                        <ul className="event-list">
                            {createdEvents.map(event => (
                                <li key={event.event_id} className="event-item">
                                    <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                                    <span className="event-name">{event.event_name}</span>
                                    <span className="event-location">{event.venue_name}</span>
                                    <a href="#" onClick={() => handleEventSelect(event.event_id)} className="view-details-link">View Details</a>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
