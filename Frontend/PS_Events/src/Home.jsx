import React from "react";
import Admin from "./Admin";
import './Home.css';
import Students from "./Students/Students";


function Home({role}) {   
    return (
        <>
            <div>
                {role === "admin" && <Admin />}
                {role === "student" && <Students />}
               
            </div>
        </>
    );
}

export default Home;
