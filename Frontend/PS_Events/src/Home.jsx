import React from "react";
import Admin from "./Admin";
import './Home.css';
import Students from "./Students/Students";
import Events from "./Admin/Events";
import RegisteredEvents from "./Students/RegisteredEvents";


function Home({role}) {   
    return (
        <>
            <div>
                {role === "admin" && <Events></Events>}
              
                {role === "student" && <Students />}

            </div>
        </>
    );
}

export default Home;
