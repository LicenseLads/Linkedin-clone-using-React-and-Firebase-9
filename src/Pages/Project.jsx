import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import ProjectComponent from "../components/ProjectComponent";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Project({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const location = useLocation();

  const loadProjectType = () => {
    if (location.pathname.startsWith("/add-project")){
        setType("add");
        return;
    }
    else if (location.pathname.startsWith("/edit-project")) {
      setType("edit");
      return;
    }
    else if (location.pathname.startsWith("/view-project")) {
      setType("view");
      return;
    }
  };

  let navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      if (!res?.accessToken) {
        navigate("/");
      } else {
        setLoading(false);
      }
    });
    loadProjectType();
  }, [location]);

  return loading ? <Loader /> : <ProjectComponent
  userName={currentUser.name}
  userId={currentUser.id}
  userRole={currentUser.accountType}
  type={type}
/>
;
}
