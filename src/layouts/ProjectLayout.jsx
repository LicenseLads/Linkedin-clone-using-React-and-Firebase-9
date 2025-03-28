import React, { useMemo, useState } from "react";
import { getCurrentUser } from "../api/FirestoreAPI";
import Topbar from "../components/common/Topbar";
import Project from "../Pages/Project";

export default function ProjectLayout() {
  const [currentUser, setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div>
      <Topbar currentUser={currentUser} />
      <Project currentUser={currentUser} />
    </div>
  );
}
