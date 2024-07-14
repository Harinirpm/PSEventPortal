import React from "react";
import './Horinav.css'
import Img from '../assets/logo.png'
import { GiHamburgerMenu } from "react-icons/gi";
function Horinav({toggleSidebar}) {
    return (
        <div className="horinav">
            <div className="title">
                <img src={Img} alt="" />
                <h3>PS Portal</h3>
            </div>
            <div className="ham">
            <GiHamburgerMenu size={22} onClick={toggleSidebar}  />
            </div>
        </div>
    )
}

export default Horinav