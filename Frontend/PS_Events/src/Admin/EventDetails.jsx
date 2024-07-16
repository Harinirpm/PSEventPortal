import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import './EventDetails.css'

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/events/${id}`);
      console.log('Fetched Event Data:', response.data); // Log the response data
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
      <FaArrowCircleLeft  size={18} color="black"/>
      </Link>
      <h1>{event.name}</h1>
      </div>
      <h3>Description:</h3><p>{event.description}</p>
      <h3>Event Start Date: </h3><p>{formatDate(event.eventStartDate)}</p>
      <h3>Event End Date:</h3> <p>{formatDate(event.eventEndDate)}</p>
      <h3>Registration Start Date:</h3><p>{formatDate(event.registrationStartDate)}</p>
      <h3>Registration End Date:</h3><p> {formatDate(event.registrationEndDate)}</p>
      <h3 >Departments: </h3><p>{departments}</p>
      <h3>Team Size:</h3> <p>{event.teamSize}</p>
      <h3>Event Mode: </h3><p>{event.eventMode}</p>
      <h3>Event Link:<br></br><br></br><a href={event.eventLink} target="_blank" rel="noopener noreferrer">{event.eventLink}</a></h3>
      {noticeUrl && <h3>Event Notice:<br></br><br></br><a href={noticeUrl} target="_blank" rel="noopener noreferrer">Download</a></h3>}
      {imageUrl && <h3>Event Image:<br></br><br></br><img src={imageUrl} alt={event.name} className="event-image" /></h3>}
      <button>Update</button>
      </div>

  );
}

export default EventDetails;
