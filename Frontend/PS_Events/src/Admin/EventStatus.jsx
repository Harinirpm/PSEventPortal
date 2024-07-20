
import './EventStatus.css';
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import { FaPen } from "react-icons/fa6";
import EventUpdateForm from "./EventUpdateForm";
import { LuEye } from "react-icons/lu";
// import TeamDetails from './TeamDetails';
import RegistrationData from './RegistrationData'

const EventStatus= () => {
    const [events, setEvents] = useState([]);
    const {id} =useParams();

    useEffect(() => {
        fetchEvents();
    }, [id]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/events/${id}`);
            console.log(response.data)
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
  return (
    <>
    <div className='event'>
    <h1>Event Status</h1>
    <div className='event-status-container'>
        <div className='team-details'>
    {/* <TeamDetails></TeamDetails> */}
    <RegistrationData name={events.name} eventid={id}/>
    </div>
    <div className="EventStatus">
        <div className="event-cards">
        {/* {events.map(event => ( */}

        {/* <Link to={`/eventupdate/:${events.id}`}> */}
                            {events.eventImage && (
                                <img
                                    width="100%"
                                    src={`http://localhost:8081/${events.eventImage.replace(/\\/g, '/')}`}
                                    alt={events.name}
                                    className="event-image"
                                />
                            )}
                            <h2 className="event-text">{events.name} <div className="icon-container">
                                <Link to={`/eventdetails/${events.id}`}>
                                    <LuEye size={23} color="blue" className="eye-icon" />
                                </Link>
                                {/* <FaPen size={18} color="black" className="pen-icon" /> */}
                            </div></h2>
                        {/* </Link> */}
                        </div>
                {/* ))} */}

    </div>
    </div>
    </div>
    
    </>
  )
}

export default EventStatus
