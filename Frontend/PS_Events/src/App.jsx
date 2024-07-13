import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import EventUploadForm from './assets/Admin/EventUploadForm';

function App() {
  return (
    <Router>
      <div className='app'>
        <h1>Landing Page</h1>
        <Link to="/upload">
          <button className='navigate-button'>Create Event</button>
        </Link>

        <Routes>
          <Route path="/upload" element={<EventUploadForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
