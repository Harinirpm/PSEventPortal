import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TeamMemberDetails.css';

const TeamMemberDetails = ({ formData, setFormData }) => {
  const { memberIndex } = useParams();
  const navigate = useNavigate();

  const initialMemberData = {
    name: '',
    rollNo: '',
    email: '',
    year: '',
    department: '',
  };

  const [memberData, setMemberData] = useState(initialMemberData);

  useEffect(() => {
    const index = parseInt(memberIndex, 10) - 1;
    if (formData.teamMembers[index]) {
      setMemberData(formData.teamMembers[index]);
    } else {
      setMemberData(initialMemberData);
    }
  }, [memberIndex, formData.teamMembers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedMembers = [...formData.teamMembers]; 
    updatedMembers[parseInt(memberIndex, 10) - 1] = memberData;
    setFormData({ ...formData, teamMembers: updatedMembers });

    setMemberData(initialMemberData);

    if (parseInt(memberIndex, 10) < formData.initialData.teamSize - 1) {
      navigate(`/team-members/${parseInt(memberIndex, 10) + 1}`);
    } else {
      navigate('/verify');
    }
  };

  const handleBack = () => {
    if (parseInt(memberIndex, 10) > 1) {
      navigate(`/team-members/${parseInt(memberIndex, 10) - 1}`);
    } else {
      const eventName = formData.initialData.eventName;
      navigate(`/eventregister/${eventName}`);
    }
  };

  return (
    <>
      <h2>Team Member {memberIndex} Details</h2>
    <div className="team-member-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Member Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={memberData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rollNo">Roll Number:</label>
          <input
            type="text"
            id="rollNo"
            name="rollNo"
            value={memberData.rollNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={memberData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            type="text"
            id="year"
            name="year"
            value={memberData.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={memberData.department}
            onChange={handleChange}
            required
          />
        </div>

        <button type="button" style={{ backgroundColor: 'gray' }}onClick={handleBack}>Back</button>
        <button type="submit">Next</button>
      </form>
    </div>
    </>
  );
};

export default TeamMemberDetails;
