import React, { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineUserSwitch,
  AiOutlineMessage,
} from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ProfilePopup from "../ProfilePopup";
import "./index.scss";

export default function Topbar({ currentUser }) {
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  const goToRoute = (route) => navigate(route);
  const displayPopup = () => setPopupVisible(!popupVisible);

  return (
    <div className="topbar-main">
      {popupVisible && (
        <div className="popup-overlay" onClick={() => setPopupVisible(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ProfilePopup />
          </div>
        </div>
      )}


      <div className="brand-logo" onClick={() => goToRoute("/home")}>
        <span className="brand-text">Meraki</span>
      </div>

      <div className="center-icons-wrapper">
        <div className="react-icons">
          <AiOutlineHome
            size={28}
            className="react-icon"
            onClick={() => goToRoute("/home")}
            title="Acasă"
          />
          <AiOutlineUserSwitch
            size={28}
            className="react-icon"
            onClick={() => goToRoute("/connections")}
            title="Conexiuni"
          />
          <BsBriefcase
            size={26}
            className="react-icon"
            onClick={() => goToRoute("/projects")}
            title="proiecte"
          />
          <AiOutlineMessage
            size={28}
            className="react-icon"
            onClick={() => goToRoute("/messages")}
            title="Mesaje"
          />
        </div>
      </div>

      <img
        className="user-logo"
        src={currentUser?.imageLink || "https://storage.googleapis.com/meraki-photos/profile/default-user.webp"}
        alt="user"
        onClick={displayPopup}
        title="Profilul meu"
      />
    </div>
  );
}
