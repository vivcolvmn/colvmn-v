import React, { useState, useReducer, useEffect } from 'react';
import EventForm from './components/EventForm';
import EventFilter from './components/EventFilter';
import EventList from './components/EventList';
import EditEventForm from './components/EditEventForm';
import mainBanner from './resources/main_banner.jpg'
import friend1 from './resources/friend1.jpg';
import friend2 from './resources/friend2.jpg';
import friend3 from './resources/friend3.jpg';
import friend4 from './resources/friend4.jpg';
import friend5 from './resources/friend5.jpg';
import profilePic from './resources/profile_pic.jpg';
import welcomeImage from './resources/welcome_image.jpg';
import './App.css';

const initialState = {
  events: [],
  likedEvents: [],
  showEditForm: false,
  eventToEdit: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(event => event.id !== action.payload) };
    case 'LIKE_EVENT':
      return { ...state, likedEvents: [...state.likedEvents, action.payload] };
    case 'FILTER_EVENTS':
      return { ...state, events: action.payload };
    case 'SHOW_EDIT_FORM':
      return { ...state, showEditForm: true, eventToEdit: action.payload };
    case 'HIDE_EDIT_FORM':
      return { ...state, showEditForm: false, eventToEdit: null };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showMainContent, setShowMainContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'SET_EVENTS', payload: data });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setLoading(false);
      });
  }, []);

  const handleJoinClick = () => {
    setShowMainContent(true);
  };

  const handleAddEvent = (event) => {
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'ADD_EVENT', payload: data });
      })
      .catch(err => console.error('Error adding event:', err));
  };

  const handleDeleteEvent = (id) => {
    fetch(`/api/events/${id}`, { method: 'DELETE' })
      .then(() => {
        dispatch({ type: 'DELETE_EVENT', payload: id });
      })
      .catch(err => console.error('Error deleting event:', err));
  };

  const handleLikeEvent = (event) => {
    dispatch({ type: 'LIKE_EVENT', payload: event });
  };

  const handleFilterEvents = (filters) => {
    if (filters.liked) {
      dispatch({ type: 'FILTER_EVENTS', payload: state.likedEvents });
    } else {
      let query = '/api/events/search?';
      if (filters.date) query += `date=${filters.date}&`;
      if (filters.band) query += `band=${filters.band}&`;
      if (filters.venue) query += `venue=${filters.venue}&`;

      fetch(query)
        .then(res => res.json())
        .then(data => {
          dispatch({ type: 'FILTER_EVENTS', payload: data });
        })
        .catch(err => console.error('Error filtering events:', err));
    }
  };

  const handleEditEvent = (event) => {
    dispatch({ type: 'SHOW_EDIT_FORM', payload: event });
  };

  const handleUpdateEvent = (updatedEvent) => {
    fetch(`/api/events/${updatedEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })
      .then(res => res.json())
      .then(data => {
        dispatch({ type: 'UPDATE_EVENT', payload: data });
        dispatch({ type: 'HIDE_EDIT_FORM' });
      })
      .catch(err => console.error('Error updating event:', err));
  };

  const handleCancelEdit = () => {
    dispatch({ type: 'HIDE_EDIT_FORM' });
  };

  return (
    <div>
      {showMainContent ? (
        <>
          <h1><img src={mainBanner} alt="main banner" className="main-banner" /></h1>
          <div className="main-content">
            <div className="sidebar-left">
              <h3>VivColvmn</h3>
              <img src={profilePic} alt="profile pic" className="profile-pic" />
              <p>Member since: 11/05/2024</p>
              <p>Quote: "Vi Veri Vniversvm Vivvs Vici"</p>
              <p>Bio: We all have gardens to tend</p>
            </div>

            <div className="main-view">
              {loading ? (
                <p>Loading events...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <>
                  <h2>Events</h2>
                  <div className="event-list">
                    <EventForm onAddEvent={handleAddEvent} />
                    <EventFilter onFilter={handleFilterEvents} />
                    {state.showEditForm ? (
                      <EditEventForm
                        event={state.eventToEdit}
                        onUpdateEvent={handleUpdateEvent}
                        onCancel={handleCancelEdit}
                      />
                    ) : (
                      <EventList
                        events={state.events}
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                        onLike={handleLikeEvent}
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="sidebar-right">
              <h3>Friends</h3>
              <ul className="friend-list">
                <li><img src={friend1} alt="Friend 1" /> Mai</li>
                <li><img src={friend2} alt="Friend 2" /> Ahuynh</li>
                <li><img src={friend3} alt="Friend 3" /> Kingliver</li>
                <li><img src={friend4} alt="Friend 4" /> Sweetnight</li>
                <li><img src={friend5} alt="Friend 5" /> Sky</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="welcome-page">
          <img src={welcomeImage} alt="Welcome" />
          <button onClick={handleJoinClick}>Join Us</button>
        </div>
      )}
    </div>
  );
};

export default App;
