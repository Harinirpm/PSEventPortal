import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EventRegistrationData.css';
import { LuEye } from "react-icons/lu";
import * as XLSX from 'xlsx';

const EventRegistrationData = ({ name, eventid }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerms, setSearchTerms] = useState({
        teamName: '',
        teamLeader: '',
        rollNo: '',
        status: ''
    });
    const [eventStatus, setEventStatus] = useState({});
    const [reportDetails, setReportDetails] = useState({});

    const location = useLocation();

    // Function to fetch data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/events/${name}/teams`);
            const teamsData = response.data;

            const updatedData = await Promise.all(
                teamsData.map(async (team) => {
                    if (!team.teamLeader) {
                        const leaderResponse = await axios.get(`http://localhost:8081/student/teams/${team.eventId}/${team.teamName}`);
                        return {
                            ...team,
                            teamLeader: leaderResponse.data.teamLeader,
                            rollNo: leaderResponse.data.rollNo
                        };
                    }
                    return team;
                })
            );

            setData(updatedData);
            setFilteredData(updatedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [name]);

    useEffect(() => {
        fetchEventStatuses();
        fetchReportDetails();
    }, [filteredData]);

    // Fetch event statuses
    const fetchEventStatuses = async () => {
        try {
            const statuses = {};
            for (const item of filteredData) {
                const response = await axios.get(`http://localhost:8081/events/report/${item.eventId}`);
                statuses[item.eventId] = response.data.eventStatus;
            }
            setEventStatus(statuses);
        } catch (error) {
            console.error('Error fetching event statuses:', error);
        }
    };

    // Fetch report details
    const fetchReportDetails = async () => {
        try {
            const reports = {};
            for (const item of filteredData) {
                const response = await axios.get(`http://localhost:8081/events/report/${item.eventId}`);
                reports[item.eventId] = response.data;
            }
            setReportDetails(reports);
        } catch (error) {
            console.error('Error fetching report details:', error);
        }
    };

    // Function to handle search input change
    const handleSearchChange = (event, column) => {
        const value = event.target.value.toLowerCase();
        setSearchTerms({ ...searchTerms, [column]: value });

        const filtered = data.filter(item =>
            (item.teamName && item.teamName.toLowerCase().includes(searchTerms.teamName.toLowerCase()) || searchTerms.teamName === '') &&
            (item.teamLeader && item.teamLeader.toLowerCase().includes(searchTerms.teamLeader.toLowerCase()) || searchTerms.teamLeader === '') &&
            (item.rollNo && item.rollNo.toLowerCase().includes(searchTerms.rollNo.toLowerCase()) || searchTerms.rollNo === '') &&
            ((getStatus(item)).toLowerCase().includes(searchTerms.status.toLowerCase()) || searchTerms.status === '')
        );
        setFilteredData(filtered);
    };

    const getStatus = (item) => {
        if (item.level1 === 0) {
            return (item.rejected === "NULL" || item.rejected === null || item.rejected === undefined) ? "Waiting for Approval" : "Rejected";
        } else if (item.level1 === 1 && item.level2 === 0) {
            return "Report to be Submitted";
        } else if (item.level1 === 1 && item.level2 === 1 && item.level2Approval === 1) {
            return "Report Reviewed";
        } else {
            return "Report yet to be reviewed";
        }
    };

    // Function to highlight searched term
    const highlightText = (text, term) => {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.split(regex).map((part, i) =>
            regex.test(part) ? <span key={i} className="highlight">{part}</span> : part
        );
    };

    const fetchTeamDetails = async (eventId, teamName) => {
        try {
            const response = await axios.get(`http://localhost:8081/events/${eventId}/teams/${teamName}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching team details:', error);
            return null;
        }
    };

    const downloadExcel = async () => {
        const dataWithDetails = await Promise.all(
            filteredData.map(async (item) => {
                const teamDetails = await fetchTeamDetails(item.eventId, item.teamName);
                return {
                    ...item,
                    teamDetails,
                    eventStatus: eventStatus[item.eventId] || 'Unknown',
                    reportDetails: reportDetails[item.eventId] || {}
                };
            })
        );

        const worksheetData = dataWithDetails.map((item, index) => {
            const leader = item.teamDetails?.members.find(member => member.isTeamLeader);
            const members = item.teamDetails?.members.filter(member => !member.isTeamLeader);

            const memberDetails = members ? members.map(member => ({
                MemberName: member.name,
                MemberEmail: member.email,
                MemberRollNo: member.rollNo,
                MemberYear: member.year,
                MemberDepartment: member.department,
            })) : [];

            return {
                SNo: index + 1,
                TeamName: item.teamName,
                TeamLeaderName: leader ? leader.name : '',
                TeamLeaderEmail: leader ? leader.email : '',
                TeamLeaderRollNo: leader ? leader.rollNo : '',
                TeamLeaderYear: leader ? leader.year : '',
                TeamLeaderDepartment: leader ? leader.department : '',
                Status: getStatus(item),
                EventStatus: item.eventStatus,
                
                ...memberDetails.reduce((acc, curr, idx) => {
                    acc[`Member${idx + 1}Name`] = curr.MemberName;
                    acc[`Member${idx + 1}Email`] = curr.MemberEmail;
                    acc[`Member${idx + 1}RollNo`] = curr.MemberRollNo;
                    acc[`Member${idx + 1}Year`] = curr.MemberYear;
                    acc[`Member${idx + 1}Department`] = curr.MemberDepartment;
                    return acc;
                }, {})
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registration Data");
        XLSX.writeFile(workbook, "RegistrationData.xlsx");
    };

    return (
        <div className='registration-data'>
            <button onClick={downloadExcel} className="download-button">Download</button>
            <div className='registration-container'>
                <div className='table-container'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>
                                    <br></br>
                                <br></br>
                                    S.No
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        placeholder="Search Team Name"
                                        value={searchTerms.teamName}
                                        onChange={(e) => handleSearchChange(e, 'teamName')}
                                    />
                                    <br></br>
                                    <br></br>
                                    Team Name
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        placeholder="Search Team Leader"
                                        value={searchTerms.teamLeader}
                                        onChange={(e) => handleSearchChange(e, 'teamLeader')}
                                    />
                                    <br></br>
                                    <br></br>
                                    Team Leader
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        placeholder="Search Roll No"
                                        value={searchTerms.rollNo}
                                        onChange={(e) => handleSearchChange(e, 'rollNo')}
                                    />
                                    <br></br>
                                    <br></br>
                                    Roll No
                                </th>
                                <th>
                                    <input
                                        type="text"
                                        placeholder="Search Status"
                                        value={searchTerms.status}
                                        onChange={(e) => handleSearchChange(e, 'status')}
                                    />
                                    <br></br>
                                    <br></br>
                                    Status
                                </th>
                                <th>
                                <br></br>
                                <br></br>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{highlightText(item.teamName || '', searchTerms.teamName)}</td>
                                    <td>{highlightText(item.teamLeader || '', searchTerms.teamLeader)}</td>
                                    <td>{highlightText(item.rollNo || '', searchTerms.rollNo)}</td>
                                    <td>{highlightText(getStatus(item), searchTerms.status)}</td>
                                    <td>
                                        <Link to={`/${eventid}/team-details/${item.eventId}/${item.teamName}/`} className={location.pathname === `/team/${item.teamName}` ? "active" : ""}>
                                            <LuEye size={23} color="blue" className="eye-icon" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventRegistrationData;


// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import './EventRegistrationData.css';
// import { LuEye } from "react-icons/lu";
// import * as XLSX from 'xlsx';

// const EventRegistrationData = ({ name, eventid }) => {
//     const [data, setData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [searchTerms, setSearchTerms] = useState({
//         teamName: '',
//         teamLeader: '',
//         rollNo: '',
//         status: ''
//     });
//     const location = useLocation();

//     // Function to fetch data from the server
//     const fetchData = async () => {
//         try {
//             console.log(name);
//             const response = await axios.get(`http://localhost:8081/events/${name}/teams`); // Adjust the URL according to your API endpoint
//             const teamsData = response.data;
//             // console.log(teamsData);

//             // Fetch team leader names if not included
//             const updatedData = await Promise.all(
//                 teamsData.map(async (team) => {
//                     if (!team.teamLeader) {
//                         const leaderResponse = await axios.get(`http://localhost:8081/student/teams/${team.eventId}/${team.teamName}`);
//                         return {
//                             ...team,
//                             teamLeader: leaderResponse.data.teamLeader,
//                             rollNo: leaderResponse.data.rollNo
//                         };
//                     }
//                     return team;
//                 })
//             );

//             setData(updatedData);
//             setFilteredData(updatedData);
//             // console.log(updatedData);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, [name]);

//     // Function to handle search input change
//     const handleSearchChange = (event, column) => {
//         const value = event.target.value.toLowerCase();
//         setSearchTerms({ ...searchTerms, [column]: value });

//         const filtered = data.filter(item =>
//             (item.teamName && item.teamName.toLowerCase().includes(searchTerms.teamName.toLowerCase()) || searchTerms.teamName === '') &&
//             (item.teamLeader && item.teamLeader.toLowerCase().includes(searchTerms.teamLeader.toLowerCase()) || searchTerms.teamLeader === '') &&
//             (item.rollNo && item.rollNo.toLowerCase().includes(searchTerms.rollNo.toLowerCase()) || searchTerms.rollNo === '') &&
//             ((getStatus(item)).toLowerCase().includes(searchTerms.status.toLowerCase()) || searchTerms.status === '')
//         );
//         setFilteredData(filtered);
//     };

//     const getStatus = (item) => {
//         if (item.level1 === 0) {
//             return (item.rejected === "NULL" || item.rejected === null || item.rejected === undefined) ? "Waiting for Approval" : "Rejected";
//         } else if (item.level1 === 1 && item.level2 === 0) {
//             return "Report to be Submitted";
//         } else if (item.level1 === 1 && item.level2 === 1 && item.level2Approval === 1) {
//             return "Report Reviewed";
//         } else {
//             return "Report yet to be reviewed";
//         }
//     };

//     // Function to highlight searched term
//     const highlightText = (text, term) => {
//         if (!term) return text;
//         const regex = new RegExp(`(${term})`, 'gi');
//         return text.split(regex).map((part, i) =>
//             regex.test(part) ? <span key={i} className="highlight">{part}</span> : part
//         );
//     };

//     const downloadExcel = () => {
//         const worksheet = XLSX.utils.json_to_sheet(filteredData.map((item, index) => ({
//             SNo: index + 1,
//             TeamName: item.teamName,
//             TeamLeader: item.teamLeader,
//             RollNo: item.rollNo,
//             Status: getStatus(item)
//         })));
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Registration Data");
//         XLSX.writeFile(workbook, "RegistrationData.xlsx");
//     };

//     return (
//         <div className='registration-data'>
//             <button onClick={downloadExcel} className="download-button">Download</button>
//             <div className='registration-container'>
//                 <div className='table-container'>
//                     <table className='table'>
//                         <thead>
//                             <tr>
//                                 <th>
//                                     <br></br>
//                                 <br></br>
//                                     S.No
//                                 </th>
//                                 <th>
//                                     <input
//                                         type="text"
//                                         placeholder="Search Team Name"
//                                         value={searchTerms.teamName}
//                                         onChange={(e) => handleSearchChange(e, 'teamName')}
//                                     />
//                                     <br></br>
//                                     <br></br>
//                                     Team Name
//                                 </th>
//                                 <th>
//                                     <input
//                                         type="text"
//                                         placeholder="Search Team Leader"
//                                         value={searchTerms.teamLeader}
//                                         onChange={(e) => handleSearchChange(e, 'teamLeader')}
//                                     />
//                                     <br></br>
//                                     <br></br>
//                                     Team Leader
//                                 </th>
//                                 <th>
//                                     <input
//                                         type="text"
//                                         placeholder="Search Roll No"
//                                         value={searchTerms.rollNo}
//                                         onChange={(e) => handleSearchChange(e, 'rollNo')}
//                                     />
//                                     <br></br>
//                                     <br></br>
//                                     Roll No
//                                 </th>
//                                 <th>
//                                     <input
//                                         type="text"
//                                         placeholder="Search Status"
//                                         value={searchTerms.status}
//                                         onChange={(e) => handleSearchChange(e, 'status')}
//                                     />
//                                     <br></br>
//                                     <br></br>
//                                     Status
//                                 </th>
//                                 <th>
//                                 <br></br>
//                                 <br></br>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredData.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{index + 1}</td>
//                                     <td>{highlightText(item.teamName || '', searchTerms.teamName)}</td>
//                                     <td>{highlightText(item.teamLeader || '', searchTerms.teamLeader)}</td>
//                                     <td>{highlightText(item.rollNo || '', searchTerms.rollNo)}</td>
//                                     <td>{highlightText(getStatus(item), searchTerms.status)}</td>
//                                     <td>
//                                         <Link to={`/${eventid}/team-details/${item.eventId}/${item.teamName}/`} className={location.pathname === `/team/${item.teamName}` ? "active" : ""}>
//                                             <LuEye size={23} color="blue" className="eye-icon" />
//                                         </Link>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EventRegistrationData;
