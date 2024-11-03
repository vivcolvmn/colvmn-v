import React, { useState } from 'react';
import Profile from './Profile'; // Import Profile component to display selected user's profile

const SearchProfile = ({ onAuthError }) => {
    const [searchQuery, setSearchQuery] = useState(''); // Stores the username query
    const [searchResults, setSearchResults] = useState([]); // Stores the list of matched profiles
    const [selectedUserId, setSelectedUserId] = useState(null); // Stores ID of the selected user for Profile view
    const [error, setError] = useState(null); // Error state for handling issues in search

    /**
     * Handles input changes for the search field.
     * @param {object} e - Event object from input change
     */
    const handleInputChange = (e) => {
        setSearchQuery(e.target.value); // Update search query state as user types
    };

    /**
     * Searches for profiles by username.
     * Fetches matching profiles from the server based on the search query.
     * @param {object} e - Event object from form submission
     */
    const handleSearch = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            // Fetch matching profiles from the backend
            const response = await fetch(`/api/user/search?username=${encodeURIComponent(searchQuery)}`, {
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
            setSearchResults(data.profiles); // Update search results with fetched profiles
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to fetch profiles'); // Set error message on fetch failure
            setSearchResults([]); // Clear previous search results on error
            console.error(err);
        }
    };

    /**
     * Handles selecting a profile from the search results.
     * Sets the selected user ID to display their profile.
     * @param {string} userId - ID of the user whose profile to display
     */
    const handleProfileSelect = (userId) => {
        setSelectedUserId(userId); // Set selected user ID for Profile view
    };

    /**
     * Resets the view back to search results from the profile view.
     */
    const handleCloseProfile = () => {
        setSelectedUserId(null); // Clear selected user ID to return to search view
    };

    return (
        <div className="search-profile">
            {selectedUserId ? (
                // Render Profile component if a user is selected
                <Profile userId={selectedUserId} onClose={handleCloseProfile} onAuthError={onAuthError} />
            ) : (
                // Render search form and results if no user is selected
                <>
                    <h2>Search Profiles</h2>
                    <form onSubmit={handleSearch} className="search-form">
                        <label>
                            Username:
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleInputChange}
                                placeholder="Search by username"
                                required
                            />
                        </label>
                        <button type="submit" className="search-button">Search</button>
                    </form>

                    {error && <p className="error-message">{error}</p>}

                    <ul className="search-results">
                        {searchResults.map((profile) => (
                            <li key={profile.user_id} className="search-result-item">
                                <button onClick={() => handleProfileSelect(profile.user_id)} className="profile-link">
                                    {profile.username}
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default SearchProfile;
