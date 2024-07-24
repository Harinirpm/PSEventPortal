import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from '../UserContext';
import './ReportSubmissionForm.css'
import { FaArrowCircleLeft } from "react-icons/fa";

const eventStatuses = ["Winner", "Second Runner", "Runner", "Participated"];

function ReportSubmissionForm() {
  const { eventName } = useParams(); // Get eventName from URL params
  const [teamName, setTeamName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [reportDocument, setReportDocument] = useState(null);
  const [geoTagImage, setGeoTagImage] = useState(null);
  const [certificates, setCertificates] = useState(null);
  const [eventStatus, setEventStatus] = useState("");
  const [imageError, setImageError] = useState("");
  const [certificatesError, setCertificatesError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const email = user.email;

  useEffect(() => {
    if (eventName) {
      console.log()
      axios
        .get(`http://localhost:8081/student/report/details`, {
          params: { eventName, email }
        })
        .then((response) => {
          const { teamName, projectTitle } = response.data;
          setTeamName(teamName || "");
          setProjectTitle(projectTitle || "");
        })
        .catch((error) => {
          console.error("Error fetching team name and project title:", error);
        });
    }
  }, [eventName, email]); // Only run once when component mounts

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("teamName", teamName);
    formData.append("projectTitle", projectTitle);
    formData.append("reportDocument", reportDocument);
    formData.append("geoTagImage", geoTagImage);
    formData.append("certificates", certificates);
    formData.append("eventStatus", eventStatus);

    axios
      .post("http://localhost:8081/student/report/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Report Submission Successful");
        navigate("/registration-status/${eventName}");
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file && !validImageTypes.includes(file.type)) {
      setImageError("Please upload a valid image file (jpg, jpeg, or png).");
      setGeoTagImage(null);
    } else {
      setImageError("");
      setGeoTagImage(file);
    }
  };

  const handleCertificatesChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setCertificatesError("Please upload a valid PDF file for certificates.");
      setCertificates(null);
    } else {
      setCertificatesError("");
      setCertificates(file);
    }
  };

  return (
    <>
    <Link to={`/registration-status/${eventName}`}>
          <FaArrowCircleLeft size={28} color="black"/>
        </Link>
      <h1>Report Submission</h1>
      <div className="reportSubmissionForm">
        <form className="submissionForm" onSubmit={handleSubmit}>
          <label>
            <p>Event Name:</p>
            <input
              className="box"
              type="text"
              placeholder="Enter Event Name"
              value={eventName}
              readOnly
            />
          </label>
          <label>
            <p>Team Name:</p>
            <input
              className="box"
              type="text"
              placeholder="Enter Team Name"
              value={teamName}
              readOnly
            />
          </label>
          <label>
            <p>Project Title:</p>
            <input
              className="box"
              type="text"
              placeholder="Enter Project Title"
              value={projectTitle}
              readOnly
            />
          </label>
          <label>
            <p>Report Document (PDF):</p>
            <input
              className="box"
              type="file"
              accept="application/pdf"
              onChange={(e) => setReportDocument(e.target.files[0])}
            />
          </label>
          <label>
            <p>Geo-tag Image:</p>
            <input
              className="box"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
            />
          </label>
          {imageError && <p className="error-message">{imageError}</p>}
          <label>
            <p>Certificates (PDF):</p>
            <input
              className="box"
              type="file"
              accept="application/pdf"
              onChange={handleCertificatesChange}
            />
          </label>
          {certificatesError && <p className="error-message">{certificatesError}</p>}
          <label>
            <p>Event Status:</p>
            <select 
              value={eventStatus}
              onChange={(e) => setEventStatus(e.target.value)}
              className={eventStatus === "" ? "default-option" : ""}
            >
              <option value="" disabled>
                Select Status
              </option>
              {eventStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="submit-button">
            Submit Report
          </button>
        </form>
      </div>
    </>
  );
}

export default ReportSubmissionForm;