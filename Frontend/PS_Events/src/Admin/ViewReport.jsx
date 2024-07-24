import React, { useState, useEffect } from "react";
import axios from "axios";
import './ViewReport.css';

const ViewReport = ({ eventId }) => {
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [teamMembers, setTeamMembers] = useState([]);
    const [rewardPoints, setRewardPoints] = useState({});
    const [level2Approval,setLevel2Approval] = useState(0);

    useEffect(() => {
        console.log(eventId)
        axios.get(`http://localhost:8081/events/report/${eventId}`)
            .then(response => {
                level2approvalStatus()
                setReport(response.data);
               // console.log(response.data)
            })
            .catch(error => {
                console.error("There was an error fetching the report!", error);
                setError("There was an error fetching the report.");
            });
    }, [eventId]);

    const fetchTeamMembers = () => {
        axios.get(`http://localhost:8081/events/team-members/${eventId}`)
            .then(response => {
                setTeamMembers(response.data);
                //console.log(teamMembers)
            })
            .catch(error => {
                console.error("There was an error fetching team members!", error);
                setError("There was an error fetching team members.");
            });
    };

    const level2approvalStatus = () => {
        axios.get(`http://localhost:8081/events/team-members/level2Approval/${eventId}`)
            .then(response => {
                //setTeamMembers(response.data);
                //console.log(teamMembers)
                setLevel2Approval(response.data.level2Approval)
                console.log(level2Approval)
            })
            .catch(error => {
                console.error("There was an error fetching team members!", error);
                setError("There was an error fetching team members.");
            });
    };

    const handleApproveClick = () => {
        setShowPopup(true);
        fetchTeamMembers();
    };

    const handleRewardChange = (id, points) => {
        setRewardPoints(prevPoints => ({ ...prevPoints, [id]: points }));
    };

    const handleSubmit = () => {
        const validRewardsData = Object.entries(rewardPoints)
            .filter(([id, points]) => id && points)
            .map(([id, points]) => ({
                studentId: id,
                eventId: eventId,
                rewardPoints: points,
            }));
            console.log(validRewardsData)

        axios.post('http://localhost:8081/events/rewards', { rewards: validRewardsData, eventId })
            .then(() => {
                alert('Rewards assigned successfully!');
                setShowPopup(false);
            })
            .catch(error => {
                console.error('There was an error assigning rewards!', error);
            });
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!report) {
        return <div>Loading...</div>;
    }

    const certUrl = report.certificates ? `http://localhost:8081/${report.certificates.replace(/\\/g, '/')}` : null;
    const imgUrl = report.geoTag ? `http://localhost:8081/${report.geoTag.replace(/\\/g, '/')}` : null;
    const docUrl = report.document ? `http://localhost:8081/${report.document.replace(/\\/g, '/')}` : null;

    return (
        <div className="view-report">
            <h1>Report :</h1>
            <p><strong>Certificates:</strong> <a href={certUrl} target="_blank" rel="noopener noreferrer">View</a></p><br />
            <p className="geo-tag-image"><strong>GeoTag Image:</strong><img src={imgUrl} alt="GeoTag" className="event-image" /></p><br />
            <p><strong>Document:</strong> <a href={docUrl} target="_blank" rel="noopener noreferrer">View</a></p><br />
            <p><strong>Event Status: </strong>{report.eventStatus}</p><br />
            { (level2Approval===0) ? <button onClick={handleApproveClick} className="approve-button">Approve</button> : <p>Approved and rewards were Awarded</p> }

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Assign Reward Points</h2>
                        {teamMembers.map(member => (
                            <div key={member.memberId} className="reward-input">
                                <p>{member.name}{member.isTeamLeader === 1 && <span>(Team Leader)</span>}</p>
                                <input
                                    className='box'
                                    type="number"
                                    placeholder="Reward Points"
                                    onChange={(e) => handleRewardChange(member.memberId, e.target.value)}
                                />
                            </div>
                        ))}
                         <div className="button-container">
                        <button onClick={handleSubmit} className="submit-button">Submit</button>
                        <button onClick={() => setShowPopup(false)} className="cancel-button">Cancel</button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewReport;
