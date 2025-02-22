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
              activeOption === "posts" ? "#0072b1" : "transparent",
            color: activeOption === "posts" ? "white" : "black"
          }}
          onClick={() => handleSwitchClick("posts")}
        >
          <div className="switch-text">Posts</div>
        </div>
        <div
          className="switch-item"
          style={{
            backgroundColor:
              activeOption === "projects" ? "#0072b1" : "transparent",
            color: activeOption === "projects" ? "white" : "black"
          }}
          onClick={() => handleSwitchClick("projects")}
        >
          <div className="switch-text">Projects</div>
        </div>
      </div>
    </div>
  );
}
