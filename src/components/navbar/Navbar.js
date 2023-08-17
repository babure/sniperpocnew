import "rsuite/dist/rsuite.css";
import "./Navbar.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import profilePhoto from "../../assets/profile.jpg";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { SidebarData } from "./SlidebarData";
import DateTimeRangePicker from "../date/DateTimeRangePicker";

export default function Navbar({ startTime, endTime, handleDateChange }) {
  const [sidebar, setSidebar] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedText, setSelectedText] = useState("ITOPS");

  const location = useLocation();

  const showSidebar = () => setSidebar(!sidebar);

  const handleItemClick = (index) => {
    setActiveItem(index);
    showSidebar();
  };

  useEffect(() => {
    const activeIndex = SidebarData.findIndex(
      (item) => item.path === location.pathname
    );
    setActiveItem(activeIndex);

    const selectedItem = SidebarData.find(
      (item) => item.path === location.pathname
    );
    if (selectedItem) {
      setSelectedText(selectedItem.title);
    } else {
      setSelectedText("ITOPS");
    }
  }, [location]);

  return (
    <>
      <IconContext.Provider value={{ color: "#FFF" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <div className="selected-text mx-4">{selectedText}</div>
          <DateTimeRangePicker
            startTime={startTime}
            endTime={endTime}
            handleDateChange={handleDateChange}
          />
          <div className="user-profile mx-5">
            <img src={profilePhoto} alt="User Profile" width={24} height={24} />
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className={sidebar ? "navbar-toggle sticky" : "navbar-toggle"}>
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            {SidebarData.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`${item.cName} ${
                    activeItem === index ? "active" : ""
                  }`}
                  onClick={() => handleItemClick(index)}
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
