import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onLogout } from "../../../api/AuthAPI";
import { getCurrentUser } from "../../../api/FirestoreAPI";
import Button from "../Button";
import "./index.scss";

export default function ProfilePopup() {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  useMemo(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return (
    <div className="popup-card">
      <p className="name">{currentUser?.name}</p>
      <Button
        title="Profilul meu"
        onClick={() => {
          navigate("/profile", {
            state: {
              id: currentUser?.id,
            },
          });
          window.location.reload();
        }}
      />
      <Button title="Deconectare" onClick={onLogout} />
    </div>
  );
}
