import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './RegistrationStatus.css'; // Create a CSS file for styling

const RegistrationStatus = () => {
  const { eventName } = useParams(); // Get eventName from URL params
  const { user } = useContext(UserContext);
  const [registrationData, setRegistrationData] = useState({
    eventName: "Tech Fest",
    teamName: "AI Wizards",
    level1: 0, // Change to 1 to see the approved status
    rejectionReason: "Incomplete submission"
  });
  const [showReason, setShowReason] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        // Fetch registration status
        const response = await axios.get(`http://localhost:8081/student/registration-status/${eventName}/${user.email}`);
        const data = response.data;

        console.log('Registration Status Data:', data);

        // Check if the response contains rejected data
        if (data.level1 === 0 && data.rejectionReason) {
          setShowReason(true);
        }

        setRegistrationData(data);

        // If level1 is 1, fetch event start date and compare with current date
        if (data.level1 === 1) {
          const eventResponse = await axios.get(`http://localhost:8081/student/events/getEventDate/${eventName}/${user.email}`);
          console.log('Event Date Data:', eventResponse.data);

          const eventStartDate = new Date(eventResponse.data.eventStartDate);
          const currentDate = new Date();

          // Compare dates directly
          if (eventStartDate <= currentDate && eventResponse.data.isTeamLeader === 1) {
            setShowSubmitButton(true);
          }
        }
      } catch (error) {
        console.error('Error fetching registration status:', error);
      }
    };

    fetchRegistrationStatus();
  }, [eventName, user.email, user.isTeamLeader]);

  const handleSubmit = () => {
    // Define what happens when the submit button is clicked
    console.log('Submit button clicked');
  };

  return (
    <>
      <h2>Registration Status</h2>
    <div className="registration-status">
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Team Name</th>
            <th>Status</th>
            {showReason && <th>Reason for Rejection</th>} 
            {showSubmitButton && <th>Action</th>} 
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{registrationData.eventName}</td>
            <td>{registrationData.teamName}</td>
            <td>{registrationData.level1 === 0 ? "Waiting For Approval" : "Approved"}</td>
            {showReason && <td className="reason">{registrationData.rejectionReason || 'N/A'}</td>} 
            {showSubmitButton && <td className="action"><Link to={`/reportSubmissionForm/${registrationData.eventName}`} ><button onClick={handleSubmit}>Submit</button></Link></td>}
          </tr>
        </tbody>
      </table>
    </div>
    </>
  );
};

export default RegistrationStatus;
