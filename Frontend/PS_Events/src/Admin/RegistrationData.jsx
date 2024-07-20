import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './RegistrationData.css';
import { LuEye } from "react-icons/lu";
import * as XLSX from 'xlsx';

const RegistrationData = ({ name, eventid }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerms, setSearchTerms] = useState({
        teamName: '',
        teamLeader: '',
        rollNo: '',
        status: ''
    });
    const location = useLocation();

    // Function to fetch data from the server
    const fetchData = async () => {
        try {
            console.log(name);
            const response = await axios.get(`http://localhost:8081/events/${name}/teams`); // Adjust the URL according to your API endpoint
            const teamsData = response.data;
            console.log(teamsData);

            // Fetch team leader names if not included
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
            console.log(updatedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [name]);

    // Function to handle search input change
    const handleSearchChange = (event, column) => {
        const value = event.target.value.toLowerCase();
        setSearchTerms({ ...searchTerms, [column]: value });

        const filtered = data.filter(item =>
            (item.teamName && item.teamName.toLowerCase().includes(searchTerms.teamName.toLowerCase()) || searchTerms.teamName === '') &&
            (item.teamLeader && item.teamLeader.toLowerCase().includes(searchTerms.teamLeader.toLowerCase()) || searchTerms.teamLeader === '') &&
            (item.rollNo && item.rollNo.toLowerCase().includes(searchTerms.rollNo.toLowerCase()) || searchTerms.rollNo === '') &&
            ((item.level1 === 0 ? "Waiting for Approval" : "Approved").toLowerCase().includes(searchTerms.status.toLowerCase()) || searchTerms.status === '')
        );
        setFilteredData(filtered);
    };

    // Function to highlight searched term
    const highlightText = (text, term) => {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.split(regex).map((part, i) =>
            regex.test(part) ? <span key={i} className="highlight">{part}</span> : part
        );
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData.map((item, index) => ({
            SNo: index + 1,
            TeamName: item.teamName,
            TeamLeader: item.teamLeader,
            RollNo: item.rollNo,
            Status: item.level1 === 0 ? "Waiting for Approval" : "Approved"
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Registration Data");
        XLSX.writeFile(workbook, "RegistrationData.xlsx");
    };

    return (
        <div className='registration-data'>
            <button onClick={downloadExcel} className="download-button">Download as Excel</button>
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
                                    <td>{highlightText(item.level1 === 0 ? "Waiting for Approval" : "Approved", searchTerms.status)}</td>
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

export default RegistrationData;
