import { useState } from "react";
import "./index.scss";

export default function CategorySwitch({ activeOption, setActiveOption }) {
  const handleSwitchClick = (option) => {
    setActiveOption(option);
  };

  return (
    <div className="switch-background">
      <div className="switch-container">
        <div
          className="switch-item"
          style={{
            backgroundColor:
              activeOption === "posts" ? "#232D3F" : "transparent",
            color: activeOption === "posts" ? "white" : "black"
          }}
          onClick={() => handleSwitchClick("posts")}
        >
          <div className="switch-text">Postări</div>
        </div>
        <div
          className="switch-item"
          style={{
            backgroundColor:
              activeOption === "projects" ? "#695242" : "transparent",
            color: activeOption === "projects" ? "white" : "black"
          }}
          onClick={() => handleSwitchClick("projects")}
        >
          <div className="switch-text">Proiecte</div>
        </div>
      </div>
    </div>
  );
}
