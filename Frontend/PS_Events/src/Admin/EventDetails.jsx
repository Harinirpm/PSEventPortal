import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { FaArrowCircleLeft } from "react-icons/fa";
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const departments = Array.isArray(event.departments)
    ? event.departments.join(', ')
    : 'N/A';

  const imageUrl = event.eventImage ? `http://localhost:8081/${event.eventImage.replace(/\\/g, '/')}` : null;
  const noticeUrl = event.eventNotice ? `http://localhost:8081/${event.eventNotice.replace(/\\/g, '/')}` : null;

  return (
    <div className="event-details">
      <div className="title">
        <Link to={`/events`}>
          <FaArrowCircleLeft size={18} color="black" />
        </Link>
        <h1>{event.name}</h1>
      </div>
      <p>Description: {event.description}</p>
      <p>Event Start Date: {formatDate(event.eventStartDate)}</p>
      <p>Event End Date: {formatDate(event.eventEndDate)}</p>
      <p>Registration Start Date: {formatDate(event.registrationStartDate)}</p>
      <p>Registration End Date: {formatDate(event.registrationEndDate)}</p>
      <p>Departments: {departments}</p>
      <p>Team Size: {event.teamSize}</p>
      <p>Event Mode: {event.eventMode}</p>
      <p>Event Link: <a href={event.eventLink} target="_blank" rel="noopener noreferrer">{event.eventLink}</a></p>
      {noticeUrl && <p>Event Notice: <a href={noticeUrl} target="_blank" rel="noopener noreferrer">Download</a></p>}
      {imageUrl && <p>Event Image:<img src={imageUrl} alt={event.name} className="event-image" /></p>}
      <div className="button-1">
      <Link to={`/update/${id}`}>
        <button>Update</button>
      </Link>
      </div>
    </div>
  );
};

export default EventDetails;
