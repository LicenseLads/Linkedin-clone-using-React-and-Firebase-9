import React from "react";
import "../Sass/ProjectsComponent.scss";
import ProjectsFeed from "./common/ProjectsFeed";

export default function ProjectsComponent({ currentUser }) {
  return (
    <div className="projects-component">
      <ProjectsFeed currentUser={currentUser} />
    </div>
  );
}
