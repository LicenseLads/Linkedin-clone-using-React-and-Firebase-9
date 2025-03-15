import React, { useMemo, useState } from "react";
import { getCurrentUser } from "../api/FirestoreAPI";
import Topbar from "../components/common/Topbar";
import Messages from "../Pages/Messages";

export default function ConnectionLayout() {
  const [currentUser, setCurrentUser] = useState({});

  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div>
      <Topbar currentUser={currentUser} />
      <Messages currentUser={currentUser} />
    </div>
  );
}
