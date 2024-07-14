import React from "react";
import { Link } from "react-router-dom";
import Img from '../assets/event.png'
import './Event.css'

function Events(){
    return(
        <div className="event">
            <h1>Landing Page</h1>
        <Link to="/upload">
          <button className='navigate-button'>Create Event</button>
        </Link>
      </div>
    )
}

export default Events

