import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './EventUpdateForm.css';

const departments = [
    'Agriculture Engineering', 'Artificial Intelligence and Data Science', 'Artificial Intelligence and Machine Learning',
    'Information Technology', 'Computer Science and Engineering', 'Computer Technology', 'Computer Science and Business System',
    'Computer Science and Design', 'Information Science Engineering', 'Electrical and Electronics Engineering', 'Electronics and Communication Engineering', 'Mechanical Engineering',
    'Civil Engineering', 'Food Technology', 'Aeronotical Engineering', 'Fasion Design', 'Bio Technology', 'Department 16',
    'Department 17'
];

const EventUpdateForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState({
        name: '',
        description: '',
        eventStartDate: null,
        eventEndDate: null,
        registrationStartDate: null,
        registrationEndDate: null,
        departments: [],
        teamSize: '',
        eventMode: '',
        eventLink: '',
        eventImage: '',
        eventNotice: ''
    });

    const [eventImage, setEventImage] = useState(null);
    const [eventNotice, setEventNotice] = useState(null);
    const [eventImageName, setEventImageName] = useState('');
    const [eventNoticeName, setEventNoticeName] = useState('');
    const [imageError, setImageError] = useState('');

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/events/${id}`);
            const eventData = response.data;
            setEvent({
                ...eventData,
                eventStartDate: eventData.eventStartDate ? new Date(eventData.eventStartDate) : null,
                eventEndDate: eventData.eventEndDate ? new Date(eventData.eventEndDate) : null,
                registrationStartDate: eventData.registrationStartDate ? new Date(eventData.registrationStartDate) : null,
                registrationEndDate: eventData.registrationEndDate ? new Date(eventData.registrationEndDate) : null,
            });
        } catch (error) {
            console.error('Error fetching event details:', error);
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({ ...prevEvent, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'eventImage') {
            setEventImage(files[0]);
            setEventImageName(files[0].name);
        } else if (name === 'eventNotice') {
            setEventNotice(files[0]);
            setEventNoticeName(files[0].name);
        }
    };

    const handleDateChange = (name, date) => {
        setEvent(prevEvent => ({ ...prevEvent, [name]: date ? new Date(date) : null }));
    };    

    const handleCheckboxChange = (department) => {
        setEvent(prevEvent => ({
            ...prevEvent,
            departments: prevEvent.departments.includes(department)
                ? prevEvent.departments.filter(dep => dep !== department)
                : [...prevEvent.departments, department]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formattedEvent = {
            ...event,
            eventStartDate: event.eventStartDate ? event.eventStartDate.toISOString().split('T')[0] : '',
            eventEndDate: event.eventEndDate ? event.eventEndDate.toISOString().split('T')[0] : '',
            registrationStartDate: event.registrationStartDate ? event.registrationStartDate.toISOString().split('T')[0] : '',
            registrationEndDate: event.registrationEndDate ? event.registrationEndDate.toISOString().split('T')[0] : '',
        };
    
        const formData = new FormData();
        for (const key in formattedEvent) {
            formData.append(key, formattedEvent[key]);
        }
        if (eventImage) formData.append('eventImage', eventImage);
        if (eventNotice) formData.append('eventNotice', eventNotice);
    
        try {
            await axios.put(`http://localhost:8081/events/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(`/details/${id}`);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (file && !validImageTypes.includes(file.type)) {
            setImageError("Please upload a valid image file (jpg, jpeg, or png).");
            setEventImage(null);
        } else {
            setImageError("");
            setEventImage(file);
        }
    };

    return (
        <>
        <h1>Update Event</h1>
        <div className="eventUpdateForm">
            <form className="updateform"onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={event.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        className='para'
                        name="description"
                        value={event.description}
                        onChange={handleChange}
                    />
                </label>
                <div className="event-dates">
                <label>
                    Event Start Date:
                    <DatePicker
                        className='box'
                        selected={event.eventStartDate}
                        onChange={(date) => handleDateChange('eventStartDate', date)}
                        dateFormat="yyyy-MM-dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="MM/DD/YYYY"
                    />
                </label>
                <label>
                    Event End Date:
                    <DatePicker
                        className='box'
                        selected={event.eventEndDate}
                        onChange={(date) => handleDateChange('eventEndDate', date)}
                        dateFormat="yyyy-MM-dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="MM/DD/YYYY"
                    />
                </label>
                </div>
                <div className="register-dates">
                <label>
                    Registration Start Date:
                    <DatePicker
                        className='box'
                        selected={event.registrationStartDate}
                        onChange={(date) => handleDateChange('registrationStartDate', date)}
                        dateFormat="yyyy-MM-dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="MM/DD/YYYY"
                    />
                </label>
                <label>
                    Registration End Date:
                    <DatePicker
                        className='box'
                        selected={event.registrationEndDate}
                        onChange={(date) => handleDateChange('registrationEndDate', date)}
                        dateFormat="yyyy-MM-dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText="MM/DD/YYYY"
                    />
                </label>
                </div>
                <label>
                    Team Size:
                    <select
                        value={event.teamSize}
                        onChange={(e) => setEvent(prevEvent => ({ ...prevEvent, teamSize: e.target.value }))}
                    >
                        <option value="" disabled hidden>Select Team Size</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </label>
                <label>
                    Event Notice:
                    <input
                        type="file"
                        name="eventNotice"
                        onChange={handleFileChange}
                    />
                    {eventNoticeName && <p>Selected file: {eventNoticeName}</p>}
                </label>
                <label>
                    Event Image:
                    <input
                        type="file"
                        name="eventImage"
                        accept=".jpg, .jpeg, .png"
                        onChange={handleFileChange}
                    />
                    {eventImageName && <p>Selected file: {eventImageName}</p>}
                    {imageError && <p className="error" style={{ color: "red" }}>{imageError}</p>}
                </label>
                <label>
                    Event Link:
                    <input
                        type="url"
                        name="eventLink"
                        value={event.eventLink}
                        onChange={handleChange}
                    />
                </label>

                <div className="radio-group">
                    <p>Select Event Mode:</p>
                    <label>
                        <input
                            type="radio"
                            value="online"
                            checked={event.eventMode === 'online'}
                            onChange={() => setEvent(prevEvent => ({ ...prevEvent, eventMode: 'online' }))}
                        /><span></span>
                        Online
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="offline"
                            checked={event.eventMode === 'offline'}
                            onChange={() => setEvent(prevEvent => ({ ...prevEvent, eventMode: 'offline' }))}
                        /><span></span>
                        Offline
                    </label>
                </div>
                <div className="checkbox-group">
                    <p>Select Departments:</p>
                    {departments.map((department, index) => (
                        <label key={index}>
                            <input
                                className="checkbox1"
                                type="checkbox"
                                checked={event.departments.includes(department)}
                                onChange={() => handleCheckboxChange(department)}
                            /> <span></span>
                            {department}
                        </label>
                    ))}
                </div>
                <button type="submit">Update Event</button>
            </form>
        </div>
    </>
    );
};

export default EventUpdateForm;
