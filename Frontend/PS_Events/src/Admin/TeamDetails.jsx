import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaArrowCircleLeft } from "react-icons/fa";
import './TeamDetails.css';

const TeamDetails = () => {
  const { eventId, teamName } = useParams();
  const [team, setTeam] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionPopup, setShowRejectionPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamDetails();
  }, [eventId, teamName]);

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/events/${eventId}/teams/${teamName}`);
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(`http://localhost:8081/events/${eventId}/teams/${teamName}/approve`);
      alert('Team approved successfully!');
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('Error approving team:', error);
    }
  };

  const handleReject = () => {
    setShowRejectionPopup(true);
  };

  const handleRejectionSubmit = async () => {
    try {
      await axios.put(`http://localhost:8081/events/${eventId}/teams/${teamName}/reject`, { rejectionReason });
      alert('Team rejected successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error rejecting team:', error);
    } finally {
      setShowRejectionPopup(false);
    }
  };

  if (!team) {
    return <div>Loading...</div>;
  }

  const teamLeader = team.members.find(member => member.isTeamLeader);

  return (
    <>
    <div className="team-details">
      <div className="title">
        <Link to={`/events`}>
          <FaArrowCircleLeft size={18} color="black" />
        </Link>
        <h1>Team: {team.teamName}</h1>
      </div>
      <p>Project Title: {team.projectTitle}</p>
      <p>Project Objective: {team.projectObjective}</p>
      <p>Existing Methodology: {team.existingMethodology}</p>
      <p>Proposed Methodology: {team.proposedMethodology}</p>
      <p>Team Size: {team.teamSize}</p>
      <h2>Team Leader</h2>
      {teamLeader ? (
        <>
          <p>Name: {teamLeader.name}</p>
          <p>Email: {teamLeader.email}</p>
          <p>Roll No: {teamLeader.rollNo}</p>
          <p>Year: {teamLeader.year}</p>
          <p>Department: {teamLeader.department}</p>
        </>
      ) : (
        <p>No team leader assigned.</p>
      )}
      <h2>Team Members</h2>
      <ul>
        {team.members.filter(member => !member.isTeamLeader).map((member, index) => (
          <li key={index}>
            <p>Name: {member.name}</p>
            <p>Email: {member.email}</p>
            <p>Roll No: {member.rollNo}</p>
            <p>Year: {member.year}</p>
            <p>Department: {member.department}</p>
          </li>
        ))}
      </ul>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={handleReject}>Reject</button>

      {showRejectionPopup && (
        <div className="rejection-popup">
          <h3>Reason for Rejection</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection"
          ></textarea>
          <button onClick={handleRejectionSubmit}>Submit</button>
          <button onClick={() => setShowRejectionPopup(false)}>Cancel</button>
        </div>
      )}
    </div>
    </>
  );
};

export default TeamDetails;
