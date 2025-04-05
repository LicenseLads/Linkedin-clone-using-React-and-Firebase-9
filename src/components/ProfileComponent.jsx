import React, { useState } from "react";
import ProfileCard from "./common/ProfileCard";
import ProfileEdit from "./common/ProfileEdit";
import AnimateTransition from "./common/AnimateTransition";

export default function ProfileComponent({ currentUser }) {
  const [isEdit, setisEdit] = useState(false);
  
  const onEdit = () => {
    setisEdit(!isEdit);
  };
  return (
    <AnimateTransition
      condition={isEdit}
      firstComponent={() => <ProfileEdit onEdit={onEdit} currentUser={currentUser} />}
      secondComponent={() => <ProfileCard currentUser={currentUser} onEdit={onEdit} />}
    />
  );
}
