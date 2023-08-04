import React, { useState, useEffect } from "react";
// import { faCog, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from './Images/Logo.png';

function Navbar() {
  const [showmenu, showmenuupdateupdate] = useState(false);
  const usenavigate = useNavigate();


  return (
    <nav className="nav">

      <img src={Logo} height={35} width={35} style={{ marginTop: "9px" }} /> &nbsp;

      <h3 style={{ fontSize: "16px", marginTop: "18px", fontFamily: "sans-serif", color: "white" }}>
        Vehicle Incident Detection System </h3>

      {/* <Link to="/Notification">
        <FontAwesomeIcon icon={faBell} style={{ fontSize: "22px", marginTop: "15px", color: "white", marginLeft: "600px" }} />
      </Link>         &nbsp;      &nbsp; */}

      {/* <Link to="/Settings">
        <FontAwesomeIcon icon={faCog} style={{ fontSize: "20px", marginTop: "15px" ,color:"white"}} />
      </Link>          &nbsp;       &nbsp; */}

      <Link
        to="/"
        style={{ fontSize: "14px", marginTop: "18px", fontFamily: "sans-serif", color: "white" , marginLeft: "630px"}} >
        Logout
      </Link>

    </nav>
  );
}

export default Navbar;