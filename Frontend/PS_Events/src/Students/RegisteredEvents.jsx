import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './RegisteredEvents.css'; // Create a CSS file for styling

const RegisteredEvents = () => {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/student/registered/${user.email}`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching registered events:', error);
      }
    };

    fetchRegisteredEvents();
  }, [user.email]);

  const handleCardClick = (eventName) => {
    navigate(`/registration-status/${eventName}`); // Use navigate for redirection
  };
  return (
    <div className="registered-events">
      <h1>Registered Events</h1>
      <div className="events-list">
        {events.map((event) => (
          <div 
            key={event.name} 
            className="event-card" 
            onClick={() => handleCardClick(event.name)} // Handle card click
          >
            <img 
              src={`http://localhost:8081/${event.eventImage.replace(/\\/g, '/')}`} 
              alt={event.name} 
              className="event-image" 
            />
            <p className="event-name">{event.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisteredEvents;
