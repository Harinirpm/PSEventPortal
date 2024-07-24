import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './TeamMemberDetails.css';
import { UserContext } from '../UserContext';

const TeamMemberDetails = ({ formData, setFormData }) => {
  const { memberIndex } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const initialMemberData = {
    name: '',
    rollNo: '',
    email: '',
    year: '',
    department: '',
  };

  const [memberData, setMemberData] = useState(initialMemberData);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(formData.teamMembers.map(member => member.rollNo));
  const [eligibleYear, setEligibleYear] = useState(null);
  const [criteriaId, setCriteriaId] = useState(null);
  const [leaderRollNo, setLeaderRollNo] = useState(formData.initialData.rollNo);

  // Fetch eligible year and criteria for the event
  useEffect(() => {
    const fetchEligibleYearAndCriteria = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/student/events/getEligibleYear/${formData.initialData.eventName}`);
        const { eligibleYear, criteria_id } = response.data;
        setEligibleYear(eligibleYear);
        setCriteriaId(criteria_id);
      } catch (error) {
        console.error('Error fetching eligible year and criteria:', error);
      }
    };

    fetchEligibleYearAndCriteria();
  }, [formData.initialData.eventName]);

  // Fetch eligible students based on year and criteria
  useEffect(() => {
    if (eligibleYear && criteriaId) {
      const fetchEligibleStudents = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/student/eligible/${eligibleYear}/${criteriaId}`);
          setEligibleStudents(response.data);
        } catch (error) {
          console.error('Error fetching eligible students:', error);
        }
      };

      fetchEligibleStudents();
    }
  }, [eligibleYear, criteriaId, formData.initialData.eventName]);

  useEffect(() => {
    // Reset the memberData to initialMemberData when memberIndex changes
    const index = parseInt(memberIndex, 10) - 1;
    if (formData.teamMembers[index]) {
      setMemberData(formData.teamMembers[index]);
    }
  }, [memberIndex, formData.teamMembers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStudentSelect = (e) => {
    const selectedRollNo = e.target.value;
    const selectedStudent = eligibleStudents.find(student => student.rollno === selectedRollNo);
    if (selectedStudent) {
      const newMemberData = {
        name: selectedStudent.name,
        rollNo: selectedStudent.rollno,
        email: selectedStudent.email,
        year: selectedStudent.yearOfStudy,
        department: selectedStudent.department,
      };
      setMemberData(newMemberData);

      const updatedMembers = [...formData.teamMembers];
      updatedMembers[parseInt(memberIndex, 10) - 1] = newMemberData;
      setFormData({ ...formData, teamMembers: updatedMembers });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[parseInt(memberIndex, 10) - 1] = memberData;
    setFormData({ ...formData, teamMembers: updatedMembers });

    setMemberData(initialMemberData);

    setSelectedStudents([...selectedStudents, memberData.rollNo]);

    const teamSize = formData.initialData.teamSize - 1; // Adjusted for team members
    const nextIndex = parseInt(memberIndex, 10) + 1;

    if (nextIndex <= teamSize) {
      navigate(`/team-members/${nextIndex}`);
    } else {
      navigate('/verify');
    }
  };

  const handleBack = () => {
    const prevIndex = parseInt(memberIndex, 10) - 1;
    if (prevIndex > 0) {
      navigate(`/team-members/${prevIndex}`);
    } else {
      const eventName = formData.initialData.eventName;
      navigate(`/eventregister/${eventName}`);
    }
  };

  // Exclude the team leader from the available students
  const availableStudents = eligibleStudents.filter(student => student.rollno !== leaderRollNo && !selectedStudents.includes(student.rollno));

  return (
    <>
      <h2>Team Member {memberIndex}</h2>
      <div className="team-member-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rollNo">Roll Number</label>
          <select
            id="rollNo"
            name="rollNo"
            value={memberData.rollNo}
            onChange={handleStudentSelect}
            required
          >
            <option value="">Select Roll Number</option>
            {availableStudents.map(student => (
              <option key={student.rollno} value={student.rollno}>
                {student.rollno} - {student.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={memberData.name}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={memberData.email}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year of Study</label>
          <input
            type="text"
            id="year"
            name="year"
            value={memberData.year}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={memberData.department}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-buttons">
          <button type="button" style={{backgroundColor: 'gray'}} onClick={handleBack}>Back</button>
          <button type="submit">Next</button>
        </div>
      </form>
      </div>
    </>
  );
};

export default TeamMemberDetails;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import './TeamMemberDetails.css';

// const TeamMemberDetails = ({ formData, setFormData }) => {
//   const { memberIndex } = useParams();
//   const navigate = useNavigate();

//   const initialMemberData = {
//     name: '',
//     rollNo: '',
//     email: '',
//     year: '',
//     department: '',
//   };

//   const [memberData, setMemberData] = useState(initialMemberData);

//   useEffect(() => {
//     const index = parseInt(memberIndex, 10) - 1;
//     if (formData.teamMembers[index]) {
//       setMemberData(formData.teamMembers[index]);
//     } else {
//       setMemberData(initialMemberData);
//     }
//   }, [memberIndex, formData.teamMembers]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMemberData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedMembers = [...formData.teamMembers]; 
//     updatedMembers[parseInt(memberIndex, 10) - 1] = memberData;
//     setFormData({ ...formData, teamMembers: updatedMembers });

//     setMemberData(initialMemberData);

//     if (parseInt(memberIndex, 10) < formData.initialData.teamSize - 1) {
//       navigate(`/team-members/${parseInt(memberIndex, 10) + 1}`);
//     } else {
//       navigate('/verify');
//     }
//   };

//   const handleBack = () => {
//     if (parseInt(memberIndex, 10) > 1) {
//       navigate(`/team-members/${parseInt(memberIndex, 10) - 1}`);
//     } else {
//       const eventName = formData.initialData.eventName;
//       navigate(`/eventregister/${eventName}`);
//     }
//   };

//   return (
//     <>
//       <h2>Team Member {memberIndex} Details</h2>
//     <div className="team-member-form">
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="name">Member Name:</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={memberData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="rollNo">Roll Number:</label>
//           <input
//             type="text"
//             id="rollNo"
//             name="rollNo"
//             value={memberData.rollNo}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={memberData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="year">Year:</label>
//           <input
//             type="text"
//             id="year"
//             name="year"
//             value={memberData.year}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="department">Department:</label>
//           <input
//             type="text"
//             id="department"
//             name="department"
//             value={memberData.department}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button type="button" style={{ backgroundColor: 'gray' }}onClick={handleBack}>Back</button>
//         <button type="submit">Next</button>
//       </form>
//     </div>
//     </>
//   );
// };

// export default TeamMemberDetails;
