import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import './Events.css';
import { CiCirclePlus } from "react-icons/ci";

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
            <h2>Event Upload</h2>
            <br></br>
            <Link to="/upload">
                <button className='navigate-button'>Create Event<CiCirclePlus className="circle-icon"/></button>
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
                            <h2 className="event-text">{event.name}</h2>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
