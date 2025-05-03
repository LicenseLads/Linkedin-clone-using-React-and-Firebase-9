import React, { useEffect, useState } from "react";
import { getCurrentUser, getUserById } from "../api/FirestoreAPI";
import Topbar from "../components/common/Topbar";
import Profile from "../Pages/Profile";
import { useSearchParams } from "react-router-dom";

export default function ProfileLayout() {
  const [currentUser, setCurrentUser] = useState({});
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  import { useLocation } from "react-router-dom";

const location = useLocation();
const id = location.state?.id;

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
