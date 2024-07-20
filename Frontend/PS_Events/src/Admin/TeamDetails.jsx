import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaArrowCircleLeft } from "react-icons/fa";
import './TeamDetails.css';

const TeamDetails = () => {
  const { eventid,eventId, teamName } = useParams();
  const [team, setTeam] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [showRejectionPopup, setShowRejectionPopup] = useState(false); // Added state for rejection popup
  const [rewardPoints, setRewardPoints] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeamDetails();
  }, [eventId, teamName]);

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/events/${eventId}/teams/${teamName}`);
      setTeam(response.data);
      console.log(eventid)
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching team details:', error);
    }
  };

  const handleApprove = () => {
   handleApprovalSubmit();
  };

  const handleReject = () => {
    setShowRejectionPopup(true); // Show rejection popup
  };

  const handleRewardChange = (name, points) => {
    setRewardPoints(prevPoints => ({ ...prevPoints, [name]: points }));
  };

  const handleApprovalSubmit = async () => {
    try {
      await axios.put(`http://localhost:8081/events/${eventId}/teams/${teamName}/approve`);

      // Filter out invalid entries
      // const validRewardsData = Object.entries(rewardPoints)
      //   .filter(([name, points]) => name && points)
      //   .map(([name, points]) => ({
      //     name,
      //     teamName,
      //     eventId,
      //     level1: points,
      //   }));

      // console.log(validRewardsData);

      // await axios.post('http://localhost:8081/events/rewards', { rewards: validRewardsData });

      alert('Team approved successfully!');
      navigate(`/eventstatus/${eventid}`);
    } catch (error) {
      console.error('Error approving team:', error);
    } finally {
      setShowApprovalPopup(false);
    }
  };

  const handleRejectionSubmit = async () => {
    try {
      await axios.put(`http://localhost:8081/events/${eventid}/teams/${teamName}/reject`, { rejectionReason });
      alert('Team rejected successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error rejecting team:', error);
    } finally {
      setShowRejectionPopup(false); // Hide rejection popup
    }
  };

  if (!team) {
    return <div>Loading...</div>;
  }

  const teamLeader = team.members?.find(member => member.isTeamLeader);

  return (
    <>
    <div className="team-detailss">
      <div className="title">
        <Link to={`/eventstatus/${eventid}`} className="back-link">
          <FaArrowCircleLeft size={28} color="black" />
        </Link>
        <h1>Team: {team.teamName}</h1>
      </div>
      <div className="detail-item"><h3>Project Title: </h3><p>{team.projectTitle}</p></div>
      <h3>Project Objective:</h3><span></span> <p>{team.projectObjective}</p>
      <h3>Existing Methodology:</h3> <span></span><p>{team.existingMethodology}</p>
      <h3>Proposed Methodology: </h3><span></span><p>{team.proposedMethodology}</p>
      <div className="detail-item"><h3>Team Size: </h3><span></span><p>{team.teamSize}</p></div>
      <h2>Team Leader</h2><span></span>
      {teamLeader ? (
        <>
        <ul>
          <div className="detail-item">
  <li><h3>Name:</h3></li>
  <p>{teamLeader.name}</p>
</div>
<div className="detail-item">
  <li><h3>Email:</h3></li>
  <p>{teamLeader.email}</p>
</div>
<div className="detail-item">
  <li><h3>Roll No:</h3></li>
  <p>{teamLeader.rollNo}</p>
</div>
<div className="detail-item">
  <li><h3>Year:</h3></li>
  <p>{teamLeader.year}</p>
</div>
<div className="detail-item">
  <li><h3>Department:</h3></li>
  <p>{teamLeader.department}</p>
</div>
</ul>

        </>
      ) : (
        <p>No team leader assigned.</p>
      )}
      <h2>Team Members</h2>
      <ul>
        {team.members?.filter(member => !member.isTeamLeader).map((member, index) => (
          <li key={index}>
            <div className="detail-item">
            <li><h3>Name:</h3></li>
              <p> {member.name}</p>
            </div>
            
            <div className="detail-item"> 
            <li><h3>Email:</h3></li> <p>{member.email}</p>
            </div>
            <div className="detail-item">
            <li><h3>Roll No:</h3></li><p> {member.rollNo}</p>
            </div>
            <div className="detail-item">
            <li><h3>Year:</h3></li><p> {member.year}</p>
            </div>
            <div className="detail-item">
            <li><h3>Department:</h3> </li><p>{member.department}</p>
            </div>
            
          </li>
        ))}
      </ul>
      <button onClick={handleApprove} className="button">Approve</button>
      <button onClick={handleReject} className="button-r">Reject</button>

      {/* {showApprovalPopup && (
        <div className="approval-popup">
          <br></br>
          <div className="title">
          <h1>Assign Reward Points</h1>
          </div>
          <div>
            <h2>Team Leader</h2>
            {teamLeader && (
              <div>
                <div className="detail-item">
                <h3>Name:</h3><p> {teamLeader.name}</p>
                </div>
                <input
                  className="reward-points"
                  type="number"
                  placeholder="Reward Points"
                  onChange={(e) => handleRewardChange(teamLeader.name, e.target.value)}
                />
              </div>
            )}
            <h2>Team Members</h2>
            {team.members?.filter(member => !member.isTeamLeader).map((member, index) => (
              <div key={index}>
                 <div className="detail-item">
                <h3>Name:</h3><p> {member.name}</p>
                </div>
                <input
                 className="reward-points"
                  type="number"
                  placeholder="Reward Points"
                  onChange={(e) => handleRewardChange(member.name, e.target.value)}
                />
              </div>
            ))}
          </div>
          <button onClick={handleApprovalSubmit} className="button-1">Submit</button>
          <button onClick={() => setShowApprovalPopup(false)} className="button-c">Cancel </button>
        </div>
      )} */}

      {showRejectionPopup && (
         <div className="overlay">
        <div className="rejection-popup">
          <h3>Rejection Reason</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejection"
          />
          <button onClick={handleRejectionSubmit}>Submit</button>
          <button onClick={() => setShowRejectionPopup(false)}>Cancel</button>
        </div>
        </div>
      )}
    </div>

    </>
  );
};

export default TeamDetails;