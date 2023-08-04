import React, { useState,useEffect } from 'react';
import {
    FaTh,
    FaBars,
    FaCarSide,
    FaRegChartBar,
    FaSoundcloud,
    FaRetweet,
    FaUser,
    FaFire,
    FaStickerMule,
    FaCamera
} from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import Navbar from './Navbar';


const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    // const [activeRoute, setActiveRoute] = useState(null);

    // const handleRouteClick = (index) => {
    //     if (index === activeRoute) {
    //         // Clicked on the same route, close the sidebar
    //         setIsOpen(false);
    //         setActiveRoute(null);
    //     } else {
    //         setIsOpen(true);
    //         setActiveRoute(index);
    //     }
    // };

   
    const menuItem = [

        {
            path: "/dashboard",
            name: "Dashboard",
            icon: <FaTh />
        },
        // {
        //     path: "/vehicledetection",
        //     name: "Vehicle Detection and Counting",
        //     icon: <FaCarSide  style={{fontSize:"18px"}}/>
        // },  
        {
            path: "/live",
            name: "Live Streaming",
            icon: <FaCamera  style={{fontSize:"18px"}}/>
        },    
        {
            path: "/wrongside",
            name: "Wrong Side Vehicle Detection",
            icon: <FaRetweet  style={{fontSize:"18px"}}/>
        },
        {
            path: "/animaldetection",
            name: "Animal Detection",
            icon: <FaStickerMule  style={{fontSize:"18px"}}/>
        },
        {
            path: "/objectdetection",
            name: "Object Detection",
            icon: <FaUser  style={{fontSize:"18px"}}/>
        },
        {
            path: "/firedetection",
            name: "Fire Detection",
            icon: <FaFire  style={{fontSize:"18px"}}/>
        },
         {
            path: "/fogwarning",
            name: "Fog Warning",
            icon: <FaSoundcloud  style={{fontSize:"20px"}}/>
        },  
    ]
    

        return (
            <>
                <Navbar />
                <div className="container">
                    <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
                        <div className="top_section">
                            <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">VIDS</h1>
                            <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                                <FaBars onClick={toggle} />
                            </div>
                        </div>
                        {
                            menuItem.map((item, index) => (
                                <NavLink to={item.path} key={index} className="link" activeclassName="active">
                                    <div className="icon">{item.icon}</div>
                                    <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                                </NavLink>
                            ))
                        }
                    </div>
                    <main>{children}</main>
                </div>
            </>
        );
    
};

export default Sidebar;