import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './RegistrationStatus.css'; 
import { FaArrowCircleLeft } from "react-icons/fa";

const RegistrationStatus = () => {
  const { eventName } = useParams(); 
  const { user } = useContext(UserContext);
  const [registrationData, setRegistrationData] = useState({});
  const [showReason, setShowReason] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [rewards, setRewards] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/student/registration-status/${eventName}/${user.email}`);
        const data = response.data;

        console.log('Registration Status Data:', data);

        // Check if the response contains rejected data
        if (data.level1 === 0 && data.rejected) {
          setShowReason(true);
        }

        setRegistrationData(data);

        // Set the status based on registration data
        if (data.level1 === 0) {
          if (data.rejected === "NULL" || data.rejected === null || data.rejected === undefined) {
            setStatus("Waiting for Approval");
          } else {
            setStatus("Rejected");
          }
        } else if (data.level1 === 1 && data.level2 === 0) {
          setStatus("Report to be Submitted");
        } else if (data.level1 === 1 && data.level2 === 1 && data.level2Approval === 1) {
          setStatus("Report Reviewed");
        } else {
          setStatus("Report yet to be reviewed");
        }

        // If level1 is 1, fetch event start date and compare with current date
        if (data.level1 === 1) {
          console.log("hi")
          const eventResponse = await axios.get(`http://localhost:8081/student/events/getEventDate/${eventName}/${user.email}`);
          console.log('Event Date Data:', eventResponse.data);

          const eventStartDate = new Date(eventResponse.data.eventStartDate);
          const currentDate = new Date();

          setRewards(eventResponse.data.rewards);

          // Compare dates directly
          if (eventStartDate <= currentDate && eventResponse.data.isTeamLeader === 1 && data.level2 === 0 && data.level1 === 1) {
            setShowSubmitButton(true);
          }
        }
      } catch (error) {
        console.error('Error fetching registration status:', error);
      }
    };

    fetchRegistrationStatus();
  }, [eventName, user.email]);

  const handleSubmit = () => {
    // Define what happens when the submit button is clicked
    console.log('Submit button clicked');
  };

  return (
   <>
   <div className='title'>
    <Link to={`/registered-events`} className="back-link">
          <FaArrowCircleLeft size={28} color="black" />
        </Link>
      <h2>Registration Status</h2>
      </div>
      <div className="registration-status">
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Team Name</th>
            <th>Status</th>
            {showReason && <th>Reason for Rejection</th>}
            {showSubmitButton && <th>Action</th>}
            {rewards && <th>Rewards Awarded</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{registrationData.eventName}</td>
            <td>{registrationData.teamName}</td>
            <td>{status}</td>
            {showReason && <td className='reason'>{registrationData.rejected}</td>}
            {showSubmitButton && (
              <td className='action'>
                <Link to={`/reportSubmissionForm/${registrationData.eventName}`}>
                  <button onClick={handleSubmit}>Submit</button>
                </Link>
              </td>
            )}
            {rewards && <td>{rewards}</td>}
          </tr>
        </tbody>
      </table>
    </div>
    </>
  );
};

export default RegistrationStatus;