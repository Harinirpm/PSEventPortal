import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyData = ({ formData }) => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleCheckboxChange = (e) => {
    setIsConfirmed(e.target.checked);
  };

  const handleFinalSubmit = async () => {
    try {
      console.log('Sending data:', formData); // Log the data being sent

      const response = await fetch('http://localhost:8081/register/team-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set to JSON
        },
        body: JSON.stringify(formData), // Send as JSON
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Unknown error');
      }

      const result = await response.json();
      console.log('Registration complete:', result);
      navigate('/'); // Navigate to the desired page after submission
    } catch (error) {
      console.error('Error completing registration:', error);
      setError(error.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="verify-data">
      <h2>Verify Your Data</h2>
      {/* Display data for verification */}
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      <div className="confirmation-checkbox">
        <input
          type="checkbox"
          id="confirm"
          name="confirm"
          checked={isConfirmed}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="confirm">I confirm that all the entered details are correct.</label>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="button" onClick={handleBack}>Back</button>
      {isConfirmed && <button type="button" onClick={handleFinalSubmit}>Submit</button>}
    </div>
  );
};

export default VerifyData;
