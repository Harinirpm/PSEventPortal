import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowCircleLeft } from "react-icons/fa";
import './EventRegister.css';

const EventRegister = ({ formData, setFormData }) => {
  const { eventName } = useParams(); 
  const { user } = useContext(UserContext);
  const [localFormData, setLocalFormData] = useState({
    eventName: eventName || '',
    year: '',
    department: '',
    teamLeaderName: '',
    rollNo: '',
    email: '',
    teamSize: '',  // Initialize teamSize as empty
    projectTitle: '',
    projectObjective: '',
    existingMethodology: '',
    proposedMethodology: ''
  });
  const [studentData, setStudentData] = useState(null);
  const [maxTeamSize, setMaxTeamSize] = useState(0); // State to hold the maximum team size
  const navigate = useNavigate();

  // Synchronize localFormData with formData whenever formData changes
  useEffect(() => {
    setLocalFormData(prevData => ({
      ...prevData,
      ...formData.initialData,
      eventName: eventName || prevData.eventName,
    }));
  }, [formData, eventName]);

  useEffect(() => {
    if (user && user.email) {
      axios.get(`http://localhost:8081/student/${user.email}`)
        .then(response => {
          console.log('Fetched student data:', response.data);
          setStudentData(Array.isArray(response.data) ? response.data[0] : response.data);
        })
        .catch(error => {
          console.error('Error fetching student details:', error);
        });
    }
  }, [user]);

  useEffect(() => {
    if (studentData) {
      console.log('Updating local form data with student data:', studentData);
      setLocalFormData(prevData => ({
        ...prevData,
        year: studentData.yearOfStudy || prevData.year,
        department: studentData.department || prevData.department,
        teamLeaderName: studentData.name || prevData.teamLeaderName,
        rollNo: studentData.rollno || prevData.rollNo,
        email: studentData.email || prevData.email,
      }));
    }
  }, [studentData]);

  useEffect(() => {
    if (eventName) {
      axios.get(`http://localhost:8081/events/teamSize/${eventName}`)
        .then(response => {
          console.log('Fetched event data:', response.data);
          setMaxTeamSize(response.data.teamSize || 0); // Ensure `teamSize` is correctly assigned
        })
        .catch(error => {
          console.error('Error fetching event details:', error);
        });
    }
  }, [eventName]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'teamSize') {
      if (value > maxTeamSize) {
        alert(`Team size cannot be more than ${maxTeamSize}`);
        return;
      }
    }

    setLocalFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update formData with localFormData and correct number of team members
    setFormData(prevData => ({
      ...prevData,
      initialData: localFormData,
      teamMembers: Array(parseInt(localFormData.teamSize, 10) - 1).fill({}),
    }));

    // Navigate based on teamSize
    if (localFormData.teamSize === '1') {
      navigate('/verify');
    } else {
      navigate('/team-members/1');
    }
  };

  return (
    <>
      <div className='title'>
        <Link to="/">
          <FaArrowCircleLeft size={18} color="black" aria-label="Back to events" />
        </Link>
        <h2>Project Team Registration Form</h2>
      </div>
      <div className='eventRegister'>
        <div className="team-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="teamName">
                <p>Team Name:</p>
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={localFormData.teamName || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="teamLeaderName">
                <p>Team Leader Name:</p>
              </label>
              <input
                type="text"
                id="teamLeaderName"
                name="teamLeaderName"
                value={localFormData.teamLeaderName || ''}
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="rollNo">
                <p>Roll Number:</p>
              </label>
              <input
                type="text"
                id="rollNo"
                name="rollNo"
                value={localFormData.rollNo || ''}
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <p>Email:</p>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={localFormData.email || ''}
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">
                <p>Year:</p>
              </label>
              <input
                id="year"
                name="year"
                value={localFormData.year || ''}
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">
                <p>Department:</p>
              </label>
              <input
                id="department"
                name="department"
                value={localFormData.department || ''}
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="teamSize">
                <p>Team size:</p>
              </label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                value={localFormData.teamSize || ''}
                onChange={handleChange}
                required
                min="1"
                max={maxTeamSize}  // Use fetched max team size
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectTitle">
                <p>Project Title:</p>
              </label>
              <input
                type="text"
                id="projectTitle"
                name="projectTitle"
                value={localFormData.projectTitle || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectObjective">
                <p>Project Objective:</p>
              </label>
              <textarea
                className='para'
                id="projectObjective"
                name="projectObjective"
                value={localFormData.projectObjective || ''}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="existingMethodology">
                <p>Existing Methodology:</p>
              </label>
              <textarea
                className='para'
                id="existingMethodology"
                name="existingMethodology"
                value={localFormData.existingMethodology || ''}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="proposedMethodology">
                <p>Methodology of Proposed Plan:</p>
              </label>
              <textarea
                className='para'
                id="proposedMethodology"
                name="proposedMethodology"
                value={localFormData.proposedMethodology || ''}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit">Next</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EventRegister;