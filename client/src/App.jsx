import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './AuthForm'; // Registration/Login component
import HomePage from './HomePage'; // Home page with event feed and friends list
import EventDetail from './EventDetail'; // Event detail component
import Profile from './Profile'; // User profile component
import SearchEvents from './SearchEvents';

function App() {
    // State to track if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // State to track the current active component to display in the HomePage feed area
    const [activeComponent, setActiveComponent] = useState('eventFeed');

    // State to store the selected event ID and user ID for viewing details
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Function to handle successful login
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setActiveComponent('eventFeed'); // Show event feed by default on login
    };

    // Function to view details of a specific event
    const viewEventDetails = (eventId) => {
        setSelectedEventId(eventId);
        setActiveComponent('eventDetail');
    };

    // Function to view profile of a specific user
    const viewUserProfile = (userId) => {
        setSelectedUserId(userId);
        setActiveComponent('profile');
    };

    // Function to display the search events component
    const showSearchEvents = () => {
        setActiveComponent('searchEvents');
    };

    return (
        <><Router>
            <div className="App">
                {/* Conditional rendering for login or homepage */}
                {!isLoggedIn ? (
                    <AuthForm onLoginSuccess={handleLoginSuccess} />
                ) : (
                    <Routes>
                        {/* Home page route */}
                        <Route
                            path="/"
                            element={<HomePage
                                viewEventDetails={viewEventDetails}
                                viewUserProfile={viewUserProfile}
                                showSearchEvents={showSearchEvents}
                                activeComponent={activeComponent} // Pass active component state to HomePage
                            />} />

                        {/* Event detail route */}
                        <Route
                            path="/event/:eventId"
                            element={<EventDetail eventId={selectedEventId} />} />

                        {/* User profile route */}
                        <Route
                            path="/profile/:userId"
                            element={<Profile userId={selectedUserId} />} />

                        {/* Search events route */}
                        <Route
                            path="/search"
                            element={<SearchEvents />} />

                        {/* Redirect to home if no matching route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>)} {/* Render the active component based on button clicks */}

                {/* Render the active component based on button clicks */}

            </div>
        </Router><div className="dynamic-content">
                {activeComponent === 'eventFeed' && <HomePage />}
                {activeComponent === 'eventDetail' && <EventDetail eventId={selectedEventId} />}
                {activeComponent === 'profile' && <Profile userId={selectedUserId} />}
                {activeComponent === 'searchEvents' && <SearchEvents />}
            </div></>
    );
}

export default App;
