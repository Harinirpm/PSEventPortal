import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { FaArrowCircleLeft } from "react-icons/fa";


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
      <h3><strong>Description:</strong></h3><p>{event.description || 'N/A'}</p>
      <h3><strong>Event Start Date:</strong></h3><p> {formatDate(event.eventStartDate)}</p>
      <h3><strong>Event End Date:</strong></h3><p> {formatDate(event.eventEndDate)}</p>
      <h3><strong>Registration Start Date:</strong></h3><p> {formatDate(event.registrationStartDate)}</p>
      <h3><strong>Registration End Date:</strong></h3><p> {formatDate(event.registrationEndDate)}</p>
      <h3><strong>Departments:</strong></h3><p> {departments}</p>
      <h3><strong>Team Size:</strong></h3><p> {event.teamSize || 'N/A'}</p>
      <h3><strong>Event Mode:</strong></h3><p> {event.eventMode || 'N/A'}</p>
      <h3><strong>Event Link:</strong></h3><p> <a href={event.eventLink} target="_blank" rel="noopener noreferrer">{event.eventLink || 'N/A'}</a></p>
      {noticeUrl && <h3><strong>Event Notice:</strong><br></br><br></br><a href={noticeUrl} target="_blank" rel="noopener noreferrer">Download</a></h3>}
      {imageUrl && <h3><strong>Event Image:</strong><br></br><br></br><img src={imageUrl} alt={event.name} className="event-image" /></h3>}
      
      <div className="button-1">
        <Link to={`/eventregister/${event.name}`}>
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
};

export default EventDetails;
