import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { FaArrowCircleLeft } from "react-icons/fa";
//import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Error fetching event details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!event) return <div>No event found.</div>;

  const departments = Array.isArray(event.departments)
    ? event.departments.join(', ')
    : 'N/A';

  const imageUrl = event.eventImage ? `http://localhost:8081/${event.eventImage.replace(/\\/g, '/')}` : null;
  const noticeUrl = event.eventNotice ? `http://localhost:8081/${event.eventNotice.replace(/\\/g, '/')}` : null;

  return (
    <div className="event-details">
      <div className="title">
        <Link to="/">
          <FaArrowCircleLeft size={18} color="black" aria-label="Back to events" />
        </Link>
        <h1>{event.name}</h1>
      </div>
      <p><strong>Description:</strong> {event.description || 'N/A'}</p>
      <p><strong>Event Start Date:</strong> {formatDate(event.eventStartDate)}</p>
      <p><strong>Event End Date:</strong> {formatDate(event.eventEndDate)}</p>
      <p><strong>Registration Start Date:</strong> {formatDate(event.registrationStartDate)}</p>
      <p><strong>Registration End Date:</strong> {formatDate(event.registrationEndDate)}</p>
      <p><strong>Departments:</strong> {departments}</p>
      <p><strong>Team Size:</strong> {event.teamSize || 'N/A'}</p>
      <p><strong>Event Mode:</strong> {event.eventMode || 'N/A'}</p>
      <p><strong>Event Link:</strong> <a href={event.eventLink} target="_blank" rel="noopener noreferrer">{event.eventLink || 'N/A'}</a></p>
      {noticeUrl && <p><strong>Event Notice:</strong> <a href={noticeUrl} target="_blank" rel="noopener noreferrer">Download</a></p>}
      {imageUrl && <p><strong>Event Image:</strong><img src={imageUrl} alt={event.name} className="event-image" /></p>}
      <div className="button-1">
          <button>Register</button>
      </div>
    </div>
  );
};

export default EventDetails;
