import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import { FaArrowCircleLeft } from "react-icons/fa";
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (event) {
      fetchTeams();
    }
  }, [event]);

  const fetchEventDetails = async () => {
    try {
      //console.log('Fetching event details for event id:', id);
      const response = await axios.get(`http://localhost:8081/events/${id}`);
      //console.log('Event details fetched:', response.data); 
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      //console.log('Fetching teams for event name:', event.name); 
      const response = await axios.get(`http://localhost:8081/events/${event.name}/teams`);
      console.log('Teams fetched:', response.data); 
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
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
      
      <h2>Registered Teams</h2>
      <table>
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.teamName}>
              <td>{team.teamName}</td>
              <td>
                <Link to={`/team-details/${team.eventId}/${team.teamName}`}>
                  <button onClick={() => console.log(`Navigating to team details for team: ${team.teamName}, event id: ${id}`)}>Review</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventDetails;
