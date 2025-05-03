import React, { useEffect, useState } from "react";
import { getCurrentUser, getUserById } from "../api/FirestoreAPI";
import Topbar from "../components/common/Topbar";
import Profile from "../Pages/Profile";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function ProfileLayout() {
  const [currentUser, setCurrentUser] = useState({});
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const location = useLocation();
  const stateId = location.state?.id;
  
  useMemo(() => {
    if (stateId) {
      return getUserById(stateId, setCurrentUser);
    }
    return getCurrentUser(setCurrentUser);
  }, [stateId]);
  return (
    <div>
      <Topbar currentUser={currentUser} />
      <Profile currentUser={currentUser} />
    </div>
  );
}
