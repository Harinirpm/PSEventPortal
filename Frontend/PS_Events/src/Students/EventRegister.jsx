import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EventRegister.css';

const departments = [
  'Agriculture Engineering', 'Artificial Intelligence and Data Science', 'Artificial Intelligence and Machine Learning',
  'Information Technology', 'Computer Science and Engineering', 'Computer Technology', 'Computer Science and Business System',
  'Computer Science and Design', 'Information Science Engineering', 'Electrical and Electronics Engineering',
  'Electronics and Communication Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Food Technology',
  'Aeronautical Engineering', 'Fashion Design', 'Bio Technology', 'Department 16', 'Department 17'
];

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const EventRegister = ({ formData, setFormData }) => {
  const { eventName } = useParams();
  const [localFormData, setLocalFormData] = useState({
    ...formData.initialData,
    eventName: eventName || '',
    year: formData.initialData.year || '', // Default to empty string if not provided
    department: formData.initialData.department || '' // Default to empty string if not provided
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      initialData: localFormData,
      teamMembers: prevData.teamMembers.length
        ? prevData.teamMembers
        : Array(parseInt(localFormData.teamSize, 10) - 1).fill({}), // Initialize team members (team size - 1)
    }));

    if (localFormData.teamSize === '1') {
      navigate('/verify');
    } else {
      navigate('/team-members/1');
    }
  };

  return (
    <>
      <h2>Project Team Registration Form</h2>
      <div className='eventRegister'>
        <div className="team-form">
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <div className="form-group">
              <label htmlFor="teamName">
                <p>Team Name:</p>
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={localFormData.teamName}
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
                value={localFormData.teamLeaderName}
                onChange={handleChange}
                required
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
                value={localFormData.rollNo}
                onChange={handleChange}
                required
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
                value={localFormData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">
                <p>Year:</p>
              </label>
              <select
                id="year"
                name="year"
                value={localFormData.year}
                onChange={handleChange}
                required
              >
                 <option value="" disabled hidden>Select Year</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department">
                <p>Department:</p>
              </label>
              <select
                id="department"
                name="department"
                value={localFormData.department}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>Select Department</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="teamSize">
                <p>Team size:</p>
              </label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                value={localFormData.teamSize}
                onChange={handleChange}
                required
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
                value={localFormData.projectTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectObjective">
                <p>Project Objective:</p></label>
              <textarea
                className='para'
                id="projectObjective"
                name="projectObjective"
                value={localFormData.projectObjective}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="existingMethodology"><p>Existing Methodology:</p></label>
              <textarea
                className='para'
                id="existingMethodology"
                name="existingMethodology"
                value={localFormData.existingMethodology}
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
                value={localFormData.proposedMethodology}
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












// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import './EventRegister.css';

// const EventRegister = ({ formData, setFormData }) => {
//   const { eventName } = useParams();
//   const [localFormData, setLocalFormData] = useState({
//     ...formData.initialData,
//     eventName: eventName || '',
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setLocalFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setFormData((prevData) => ({
//       ...prevData,
//       initialData: localFormData,
//       teamMembers: prevData.teamMembers.length
//         ? prevData.teamMembers
//         : Array(parseInt(localFormData.teamSize, 10) - 1).fill({}), // Initialize team members (team size - 1)
//     }));

//     if (localFormData.teamSize === '1') {
//       navigate('/verify');
//     } else {
//       navigate('/team-members/1');
//     }
//   };

//   return (
//     <>
//       <h2>Project Team Registration Form</h2>
//     <div className='eventRegister'>
//     <div className="team-form">
//       <form onSubmit={handleSubmit}>
//         {/* Form fields */}
//         <div className="form-group">
//           <label htmlFor="teamName">Team Name:</label>
//           <input
//             type="text"
//             id="teamName"
//             name="teamName"
//             value={localFormData.teamName}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="teamLeaderName">Team Leader Name:</label>
//           <input
//             type="text"
//             id="teamLeaderName"
//             name="teamLeaderName"
//             value={localFormData.teamLeaderName}
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
//             value={localFormData.rollNo}
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
//             value={localFormData.email}
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
//             value={localFormData.year}
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
//             value={localFormData.department}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="teamSize">Team size:</label>
//           <input
//             type="number"
//             id="teamSize"
//             name="teamSize"
//             value={localFormData.teamSize}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="projectTitle">Project Title:</label>
//           <input
//             type="text"
//             id="projectTitle"
//             name="projectTitle"
//             value={localFormData.projectTitle}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="projectObjective">Project Objective:</label>
//           <textarea
//             id="projectObjective"
//             name="projectObjective"
//             value={localFormData.projectObjective}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         <div className="form-group">
//           <label htmlFor="existingMethodology">Existing Methodology:</label>
//           <textarea
//             id="existingMethodology"
//             name="existingMethodology"
//             value={localFormData.existingMethodology}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         <div className="form-group">
//           <label htmlFor="proposedMethodology">Methodology of Proposed Plan:</label>
//           <textarea
//             id="proposedMethodology"
//             name="proposedMethodology"
//             value={localFormData.proposedMethodology}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         <button type="submit">Next</button>
//       </form>
//     </div>
//     </div>
//     </>
//   );
// };

// export default EventRegister;

