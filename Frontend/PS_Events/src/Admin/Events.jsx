import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8081/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    return (
        <div className="event">
            <h1>Landing Page</h1>
            <Link to="/upload">
                <button className='navigate-button'>Create Event</button>
            </Link>
            <div className="event-cards">
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        <Link to={`/details/${event.id}`}>
                            {event.eventImage && (
                                <img
                                    src={`http://localhost:8081/${event.eventImage.replace(/\\/g, '/')}`}
                                    alt={event.name}
                                    className="event-image"
                                />
                            )}
                            <h2>{event.name}</h2>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
