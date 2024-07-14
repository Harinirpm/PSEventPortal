import React, { useState } from 'react';
import axios from 'axios';
import "./EventUploadForm.css";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const departments = [
    // 'Agriculture Engineering', 'Artificial Intelligence and Data Science', 'Artificial Intelligence and Machine Learning', 
    // 'Computer Science and Engineering','Computer Technology', 'Computer Science and Business System', 'Computer science and Design', 
    'Agriculture Engineering','Artificial Intelligence and Data Science', 'Artificial Intelligence and Machine Learning',
    'Information Technology','Computer Science and Engineering','Computer Technology','Computer Science and Business System',
    'Computer Science and Design',
    'Information Science Engineering','Electrical and Electronics Engineering','Electronics and Communication Engineering', 'Mechanical Engineering', 
    'Civil Engineering', 'Food Technology',
    'Aeronotical Engineering', 'Fasion Design', 'Bio Technology', 'Department 16',
    'Department 17'
];

export default function EventUploadForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [eventNotice, setEventNotice] = useState(null);
    const [eventStartDate, setEventStartDate] = useState(null);
    const [eventEndDate, setEventEndDate] = useState(null);
    const [registrationStartDate, setRegistrationStartDate] = useState(null);
    const [registrationEndDate, setRegistrationEndDate] = useState(null);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [teamSize, setTeamSize] = useState("");
    const [eventLink, setEventLink] = useState("");
    const [eventMode, setEventMode] = useState("");

    const handleCheckboxChange = (department) => {
        setSelectedDepartments(prevState => 
            prevState.includes(department)
                ? prevState.filter(dep => dep !== department)
                : [...prevState, department]
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const eventData = {
            name,
            description,
            eventStartDate: eventStartDate ? eventStartDate.toISOString().split('T')[0] : '',
            eventEndDate: eventEndDate ? eventEndDate.toISOString().split('T')[0] : '',
            registrationStartDate: registrationStartDate ? registrationStartDate.toISOString().split('T')[0] : '',
            registrationEndDate: registrationEndDate ? registrationEndDate.toISOString().split('T')[0] : '',
            departments: selectedDepartments,
            teamSize,
            eventLink,
            eventNotice,
            eventMode
        };
        // const handleSubmit = (event) => {
        //     event.preventDefault();
        //     const eventData = new FormData();
        //     eventData.append('name', name);
        //     eventData.append('description', description);
        //     eventData.append('eventStartDate', eventStartDate ? eventStartDate.toISOString().split('T')[0] : '');
        //     eventData.append('eventEndDate', eventEndDate ? eventEndDate.toISOString().split('T')[0] : '');
        //     eventData.append('registrationStartDate', registrationStartDate ? registrationStartDate.toISOString().split('T')[0] : '');
        //     eventData.append('registrationEndDate', registrationEndDate ? registrationEndDate.toISOString().split('T')[0] : '');
        //     eventData.append('departments', selectedDepartments);
        //     eventData.append('teamSize', teamSize);
        //     eventData.append('eventLink', eventLink);
        //     eventData.append('eventMode', eventMode); // Append event mode to form data
        //     if (eventNotice) {
        //         eventData.append('eventNotice', eventNotice);
        //     }
    

        console.log('Event Data:', eventData);
        axios.post('https://event-upload-admin/events', eventData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Event created successfully:', response.data);
                // Optionally reset the form
                setName("");
                setDescription("");
                setEventStartDate(null);
                setEventEndDate(null);
                setRegistrationStartDate(null);
                setRegistrationEndDate(null);
                setSelectedDepartments([]);
                setTeamSize("");
                setEventLink("");
                setEventNotice(null);
                setEventMode("");
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error response:', error.response);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
            });
    };
    return (
        <div className='eventUploadForm'>
            <form className='uploadform' onSubmit={handleSubmit}>
                <label>
                    <p>Event Name:</p>
                    <input
                        className='box'
                        type='text'
                        placeholder='Enter Event Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    <p>Event Description:</p>
                    <textarea
                        className='para'
                        placeholder='Enter Event Description with Address.'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <label>
                    <p>Event Notice:</p>
                    <input
                        className='box'
                        type='file'
                        onChange={(e) => setEventNotice(e.target.files[0])}
                    />
                </label>
                <label>
                    <p>Event Start Date:</p>
                    <DatePicker
                        className='box'
                        selected={eventStartDate}
                        onChange={date => setEventStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="MM/DD/YYYY"
                    />
                </label>
                <label>
                    <p>Event End Date:</p>
                    <DatePicker
                        className='box'
                        selected={eventEndDate}
                        onChange={date => setEventEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="MM/DD/YYYY"
                    />
                </label>
                <label>
                    <p>Registration Start Date:</p>
                    <DatePicker
                        className='box'
                        selected={registrationStartDate}
                        onChange={date => setRegistrationStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="MM/DD/YYYY"
                    />
                </label>
                <label>
                    <p>Registration End Date:</p>
                    <DatePicker
                        className='box'
                        selected={registrationEndDate}
                        onChange={date => setRegistrationEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="MM/DD/YYYY"
                    />
                    <div className='radio-group'>
                    <p>Select Event Mode:</p>
                    <label>
                        <input
                            type='radio'
                            value='online'
                            checked={eventMode === 'online'}
                            onChange={() => setEventMode('online')}
                        /><span></span>
                        Online
                    </label>
                    <label>
                        <input
                            type='radio'
                            value='offline'
                            checked={eventMode === 'offline'}
                            onChange={() => setEventMode('offline')}
                        /><span></span>
                        Offline
                    </label>
                </div>
                </label>
                <div className='checkbox-group'>
                    <p>Select Departments:</p>
                    {departments.map((department, index) => (
                        <label key={index}>
                            <input
                                className='checkbox1'
                                type='checkbox'
                                checked={selectedDepartments.includes(department)}
                                onChange={() => handleCheckboxChange(department)}
                            /> <span></span>
                            {department}
                        </label>
                    ))}
                </div>
                <label >
                    <p>Team Size:</p>
                    <select
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                    >
                        <option value="" >Select Team Size</option>
                        <option value="1" >1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </label>
                <label>
                    <p>Event Website Link:</p>
                    <input
                        className='box'
                        type='text'
                        placeholder='Enter Event Link'
                        value={eventLink}
                        onChange={(e) => setEventLink(e.target.value)}
                    />
                </label>
                
                
                <button type='submit'>Submit</button>
            </form>
        </div>
    );
}