import React, { useState } from 'react';

const CreateEvent = ({ onEventCreated, onAuthError }) => {
    const [formData, setFormData] = useState({
        eventName: '',
        date: '',
        venueName: '',
        venueAddress: '',
        time: '',
        cost: '',
        flierImage: null,
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    /**
     * Updates the form data state as user inputs values.
     * Handles both text input and file input for the flier image.
     * @param {object} e - Event object from input change
     */
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value, // File input handled separately
        }));
    };

    /**
     * Submits the form data to the server for creating a new event.
     * Constructs a `FormData` object for handling file upload along with other text fields.
     * @param {object} e - Event object from form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Authentication token not found');

            // Construct FormData to handle both text data and file upload
            const formDataToSend = new FormData();
            formDataToSend.append('eventName', formData.eventName);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('venueName', formData.venueName);
            formDataToSend.append('venueAddress', formData.venueAddress);
            formDataToSend.append('time', formData.time);
            formDataToSend.append('cost', formData.cost);
            formDataToSend.append('flierImage', formData.flierImage); // Uploading flier image

            // Send POST request to server with Authorization header
            const response = await fetch('/api/user/new_event', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Attach JWT for authentication
                },
                body: formDataToSend, // Body as FormData for multipart handling
            });

            if (response.status === 401) {
                localStorage.removeItem('token'); // Clear token if unauthorized
                if (onAuthError) onAuthError(); // Notify parent component of auth error
                throw new Error('Session expired. Please log in again.');
            }

            if (!response.ok) throw new Error('Error creating event');

            setSuccessMessage('Event created successfully');
            setError(null);
            setFormData({
                eventName: '',
                date: '',
                venueName: '',
                venueAddress: '',
                time: '',
                cost: '',
                flierImage: null,
            });
            if (onEventCreated) onEventCreated(); // Notify parent if provided
        } catch (err) {
            setError(err.message || 'Failed to create event');
            setSuccessMessage(null);
            console.error(err);
        }
    };

    return (
        <div className="create-event">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit} className="create-event-form">
                <label>
                    Event Name:
                    <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Date:
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Venue Name:
                    <input
                        type="text"
                        name="venueName"
                        value={formData.venueName}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Venue Address:
                    <input
                        type="text"
                        name="venueAddress"
                        value={formData.venueAddress}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Time:
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Cost:
                    <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Flier Image:
                    <input
                        type="file"
                        name="flierImage"
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit" className="create-event-button">Create Event</button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default CreateEvent;
