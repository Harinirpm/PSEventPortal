import React, { useState,useEffect } from 'react';
import axios from 'axios';
import "./EventUploadForm.css";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

const departments = [
    'Agriculture Engineering','Artificial Intelligence and Data Science', 'Artificial Intelligence and Machine Learning',
    'Information Technology','Computer Science and Engineering','Computer Technology','Computer Science and Business System',
    'Computer Science and Design',
    'Information Science Engineering','Electrical and Electronics Engineering','Electronics and Communication Engineering', 'Mechanical Engineering', 
    'Civil Engineering', 'Food Technology',
    'Aeronotical Engineering', 'Fasion Design', 'Bio Technology'
];

const years = ["1", "2", "3", "4"];


function EventUploadForm() {
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
    const [eventImage, setEventImage] = useState(null);
    const [imageError, setImageError] = useState("");
    const [errors, setErrors] = useState({});
    const [eligibleYears, setEligibleYears] = useState([]);
  const [testTitles, setTestTitles] = useState({});
  const [levels, setLevels] = useState({});
  const [selectedTestTitles, setSelectedTestTitles] = useState({});
  const [selectedLevels, setSelectedLevels] = useState({});
  const navigate = useNavigate();

    const handleCheckboxChangedept = (department) => {
        setSelectedDepartments(prevState => 
            prevState.includes(department)
                ? prevState.filter(dep => dep !== department)
                : [...prevState, department]
        );
    };
    const handleCheckboxChange = (setFunction, value) => {
        setFunction((prevState) =>
          prevState.includes(value)
            ? prevState.filter((item) => item !== value)
            : [...prevState, value]
        );
      };

    const validateForm = () => {
        const newErrors = {};

        if (!name) newErrors.name = "Event Name is required";
        if (!description) newErrors.description = "Event Description is required";
        if (!eventStartDate) newErrors.eventStartDate = "Event Start Date is required";
        if (!eventEndDate) newErrors.eventEndDate = "Event End Date is required";
        if (!registrationStartDate) newErrors.registrationStartDate = "Registration Start Date is required";
        if (!registrationEndDate) newErrors.registrationEndDate = "Registration End Date is required";
        if (eventStartDate && eventEndDate && eventStartDate >= eventEndDate) newErrors.eventEndDate = "Event End Date must be after Start Date";
        if (registrationStartDate && registrationEndDate && registrationStartDate >= registrationEndDate) newErrors.registrationEndDate = "Registration End Date must be after Start Date";
        if (selectedDepartments.length === 0) newErrors.selectedDepartments = "At least one department must be selected";
        if (!teamSize) newErrors.teamSize = "Team Size is required";
        if (!eventLink) newErrors.eventLink = "Event Link is required";
        if (!eventMode) newErrors.eventMode = "Event Mode is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        // Fetch test titles based on selected eligible years
        eligibleYears.forEach((year) => {
          if (!testTitles[year]) {
            fetchTestTitles(year);
          }
        });
      }, [eligibleYears]);
    
      useEffect(() => {
        // Fetch levels based on selected eligible years and test titles
        Object.keys(selectedTestTitles).forEach((year) => {
          if (selectedTestTitles[year]) {
            fetchLevels(year, selectedTestTitles[year]);
          }
        });
      }, [selectedTestTitles]);
    
      const fetchTestTitles = async (year) => {
        try {
          const response = await axios.get(
            `http://localhost:8081/criteria/testTitles/${year}`
          );
          setTestTitles((prev) => ({ ...prev, [year]: response.data }));
        } catch (error) {
          console.error("Error fetching test titles:", error);
        }
      };
    
      const fetchLevels = async (year, testTitle) => {
        try {
          const response = await axios.get(
            `http://localhost:8081/criteria/levels/${year}/${testTitle}`
          );
          const levels = response.data;
          setLevels((prev) => ({
            ...prev,
            [year]: { ...prev[year], [testTitle]: levels },
          }));
        } catch (error) {
          console.error("Error fetching levels:", error);
        }
      };
    

    const handleSubmit = (event) => {
        event.preventDefault();
        // console.log("Name:", name);
        // console.log("Description:", description);
        // console.log("Event Start Date:", eventStartDate);
        // console.log("Event End Date:", eventEndDate);
        if (!validateForm()) {
            return;
        }
    const eventData = new FormData();
    eventData.append("name", name);
    eventData.append("description", description);
    eventData.append(
      "eventStartDate",
      eventStartDate ? eventStartDate.toISOString().split("T")[0] : ""
    );
    eventData.append(
      "eventEndDate",
      eventEndDate ? eventEndDate.toISOString().split("T")[0] : ""
    );
    eventData.append(
      "registrationStartDate",
      registrationStartDate
        ? registrationStartDate.toISOString().split("T")[0]
        : ""
    );
    eventData.append(
      "registrationEndDate",
      registrationEndDate ? registrationEndDate.toISOString().split("T")[0] : ""
    );
    eventData.append("departments", selectedDepartments.join(","));
    eventData.append("teamSize", teamSize);
    eventData.append("eventLink", eventLink);
    eventData.append("eventMode", eventMode);
    eventData.append("eligibleYears", eligibleYears.join(","));
  
    // Append criteria details
    const criteria = eligibleYears.map((year) => ({
      year,
      testTitle: selectedTestTitles[year] || "",
      level: selectedLevels[year] || "",
  }));

  // Append criteria data as a JSON string
  eventData.append("criteria", JSON.stringify(criteria));

  
    // Append files if selected
    if (eventNotice) {
      eventData.append("eventNotice", eventNotice, eventNotice.name);
    }
    if (eventImage) {
      eventData.append("eventImage", eventImage, eventImage.name);
    }
  
    axios
      .post("http://localhost:8081/events/upload", eventData) 
      .then((response) => {
        console.log(response.data);
        alert("Event created successfully:");
        navigate("/events");

      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      });
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
            <h1>Upload Event Details</h1>
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
                            required
                        />
                        {errors.name && <p className="error" style={{color: "red"}}>{errors.name}</p>}
                    </label>
                    <label>
                        <p>Event Description:</p>
                        <textarea
                            className='para'
                            placeholder='Enter Event Description with Address.'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        {errors.description && <p className="error" style={{color: "red"}}>{errors.description}</p>}
                    </label>
                    <div className='event-dates'>
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
                                required
                            />
                            {errors.eventStartDate && <p className="error" style={{color: "red"}}>{errors.eventStartDate}</p>}
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
                                required
                            />
                            {errors.eventEndDate && <p className="error" style={{color: "red"}}>{errors.eventEndDate}</p>}
                        </label>
                    </div>
                    <div className='register-dates'>
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
                                required
                            />
                            {errors.registrationStartDate && <p className="error" style={{color: "red"}}>{errors.registrationStartDate}</p>}
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
                                required
                            />
                            {errors.registrationEndDate && <p className="error" style={{color: "red"}}>{errors.registrationEndDate}</p>}
                        </label>
                    </div>
                    <label>
                        <p>Team Size:</p>
                        <select
                            value={teamSize}
                            onChange={(e) => setTeamSize(e.target.value)}
                            className={teamSize === "" ? "default-option" : ""}
                            required
                        >
                            <option value="" disabled hidden>Select Team Size</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        {errors.teamSize && <p className="error" style={{color: "red"}}>{errors.teamSize}</p>}
                    </label>
                    <label>
                        <p>Event Notice:</p>
                        <input
                            className='box'
                            type='file'
                             accept="application/pdf"
                            onChange={(e) => setEventNotice(e.target.files[0])}
                            required
                        />
                    </label>
                    <label>
                        <p>Event Image:</p>
                        <input
                            className='box'
                            type='file'
                           accept="image/jpeg,image/png,image/jpg"
                            onChange={handleImageChange}
                            required
                        />
                        {imageError && <p className="error" style={{color: "red"}}>{imageError}</p>}
                    </label>
                    <label>
                        <p>Event Website Link:</p>
                        <input
                            className='box'
                            type='text'
                            placeholder='Enter Event Link'
                            value={eventLink}
                            onChange={(e) => setEventLink(e.target.value)}
                            required
                        />
                        {errors.eventLink && <p className="error" style={{color: "red"}}>{errors.eventLink}</p>}
                    </label>
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
                        {errors.eventMode && <p className="error" style={{color: "red"}}>{errors.eventMode}</p>}
                    </div>
                    <div className='checkbox-group'>
                        <p>Select Departments:</p>
                        {departments.map((department, index) => (
                            <label key={index}>
                                <input
                                    className='checkbox1'
                                    type='checkbox'
                                    checked={selectedDepartments.includes(department)}
                                    onChange={() => handleCheckboxChangedept(department)}
                                /> <span></span>
                                {department}
                            </label>
                        ))}
                        {errors.selectedDepartments && <p className="error" style={{color: "red"}}>{errors.selectedDepartments}</p>}
                    </div>

                    <label>
                        <div className='eligible-year-group'>
            <p>Eligible Years:</p>
            {years.map((year) => (
              <label key={year}>
                <input
              className='checkbox1'
                  type="checkbox"
                  value={year}
                  checked={eligibleYears.includes(year)}
                  onChange={(e) => {
                    const updatedYears = e.target.checked
                      ? [...eligibleYears, year]
                      : eligibleYears.filter((y) => y !== year);
                    setEligibleYears(updatedYears);
                  }}
                /><span></span>
                {year}
              </label>
            ))}
            </div>
          </label>

          {eligibleYears.map((year) => (
            <div key={year} className="criteria">
              <label>
                <p>Test Title for Year {year}:</p>
                <select
                  value={selectedTestTitles[year] || ""}
                  onChange={(e) =>
                    setSelectedTestTitles((prev) => ({
                      ...prev,
                      [year]: e.target.value,
                    }))
                  }
                  className={selectedTestTitles[year] === "" ? "default-option" : ""}
                >
                  <option value="" disabled>
                    Select Test Title
                  </option>
                  {(testTitles[year] || []).map((testTitle) => (
                    <option key={testTitle} value={testTitle}>
                      {testTitle}
                    </option>
                  ))}
                </select>
              </label>
              {selectedTestTitles[year] && (
                <label>
                  <p>Level for {selectedTestTitles[year]}:</p>
                  <select
                    value={
                      (selectedLevels[year] &&
                        selectedLevels[year][selectedTestTitles[year]]) ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedLevels((prev) => ({
                        ...prev,
                        [year]: {
                          ...prev[year],
                          [selectedTestTitles[year]]: e.target.value,
                        },
                      }))
                    }
                    className={
                      !(
                        selectedLevels[year] &&
                        selectedLevels[year][selectedTestTitles[year]]
                      )
                        ? "default-option"
                        : ""
                    }
                  >
                    <option value="" disabled>
                      Select Level
                    </option>
                    {(
                      (levels[year] && levels[year][selectedTestTitles[year]]) ||
                      []
                    ).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          ))}
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </>
    );
}

export default EventUploadForm;
