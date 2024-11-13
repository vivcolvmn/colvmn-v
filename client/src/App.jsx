import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import Events from './components/Event';
import Profile from './components/Profile';
import FriendsList from './components/FriendsList';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks if the user is logged in
    const [view, setView] = useState('events'); // Controls which main component is displayed: 'events', 'profile', or 'friends'
    const [selectedFriendId, setSelectedFriendId] = useState(null); // Stores the ID of the selected friend for viewing their profile
    const [currentUser, setCurrentUser] = useState(null); // Stores current user data for the sidebar
    const [token, setToken] = useState(localStorage.setItem('token', token)); // Store user-input token

    /**
     * Checks for an existing token in localStorage on app load to verify authentication status.
     * Sets the user as authenticated if a token is found.
     */

    useEffect(() => {
        console.log(token);
        if (token) {
            setIsAuthenticated(true);
            setToken(token);
            fetchCurrentUser(); // Fetch current user data
        }
    }, [token]);

    /**
     * Fetches current user data for display in the sidebar.
     */
    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/:user_id', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
            } else {
                handleLogout(); // Log out if token is invalid
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            handleLogout(); // Log out on failure
        }
    };

    /**
     * Handles successful authentication by setting the authenticated state
     * and fetching user data.
     */
    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        fetchCurrentUser();
    };

    /**
     * Logs the user out by clearing the token from localStorage and resetting the state.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setView('events'); // Reset to default view
    };

    /**
     * Renders different components based on the current view.
     */
    const renderContent = () => {
        if (!isAuthenticated) {
            return <AuthForm onAuthSuccess={handleAuthSuccess} />;
        }

        switch (view) {
            case 'events':
                return <Events onAuthError={handleLogout} />;
            case 'profile':
                return selectedFriendId ? (
                    <Profile userId={selectedFriendId} onClose={() => setView('events')} onAuthError={handleLogout} />
                ) : (
                    <Profile userId={currentUser?.user_id} isCurrentUser={true} onClose={() => setView('events')} onAuthError={handleLogout} />
                );
            case 'friends':
                return <FriendsList onAuthError={handleLogout} />;
            default:
                return <Events onAuthError={handleLogout} />;
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1><img className="welcome" src="./src/welcome.png" alt="header"></img></h1>
                {isAuthenticated && (
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                )}
            </header>

            <div className="main-content">
                {isAuthenticated && currentUser && (
                    <aside className="sidebar-left">
                        <h3>{currentUser.username}</h3>
                        <img src={currentUser.profile_picture} alt={`${currentUser.username}'s profile`} className="profile-pic"/>
                        <p>Member since: {new Date(currentUser.member_since).toLocaleDateString()}</p>
                        <p>Quote: "{currentUser.quote}"</p>
                        <p>Bio: {currentUser.bio}</p>
                        <button onClick={() => setView('profile')} className="view-profile-btn">Show Profile Details</button>
                    </aside>
                )}

                <main className="main-view">
                    {renderContent()}
                </main>

                {isAuthenticated && currentUser && (
                    <aside className="sidebar-right">
                        <h3>Friends</h3>
                        <ul className="friend-list">
                            {currentUser.friends.slice(0, 5).map(friend => (
                                <li key={friend.user_id} className="friend-item">
                                    <span onClick={() => { setSelectedFriendId(friend.user_id); setView('profile'); }} className="friend-username">
                                        {friend.username}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setView('friends')} className="view-all-friends-btn">View All Friends</button>
                    </aside>
                )}
            </div>
        </div>
    );
};

export default App;
