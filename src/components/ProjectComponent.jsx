import React, { useEffect, useState } from "react";
import "../Sass/ProjectComponent.scss";
import { ProjectForm } from "./common/ProjectForm";
import ProjectView from "./common/ProjectView";
import { getCurrentUser } from "../api/FirestoreAPI";

export default function ProjectComponent({ type, userId, userName }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  const renderProjectComponent = () => {
    if (!currentUser) return null; // Sau un loader

    switch (type) {
      case "add":
        return (
          <ProjectForm
            currentUserId={userId}
            currentUserRole={currentUser.accountType}
            entryId={null}
          />
        );
      case "edit":
        return (
          <ProjectForm
            currentUserId={userId}
            currentUserRole={currentUser.accountType}
            entryId={type}
          />
        );
      case "view":
        return (
          <ProjectView
            currentUserName={userName}
            currentUserId={userId}
            currentUserRole={currentUser.accountType}
            entryId={type}
          />
        );
      default:
        return null;
    }
  };

  return <div className="project-component">{renderProjectComponent()}</div>;
}
