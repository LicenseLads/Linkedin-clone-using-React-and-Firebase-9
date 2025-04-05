import React, { useMemo, useState } from "react";
import { getCurrentUser, getUserById } from "../api/FirestoreAPI";
import Topbar from "../components/common/Topbar";
import Profile from "../Pages/Profile";
import { useSearchParams } from "react-router-dom";

export default function ProfileLayout() {
  const [currentUser, setCurrentUser] = useState({});
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useMemo(() => {
    if (id !== undefined && id) {
      return getUserById(id, setCurrentUser);
    }
    return getCurrentUser(setCurrentUser);
  }, [id]);
  return (
    <div>
      <Topbar currentUser={currentUser} />
      <Profile currentUser={currentUser} />
    </div>
  );
}
