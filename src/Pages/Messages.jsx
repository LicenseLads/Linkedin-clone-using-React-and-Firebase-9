import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Loader from "../components/common/Loader";
import MessagesComponent from "../components/MessagesComponent";
import { useNavigate } from "react-router-dom";

export default function Messages({ currentUser }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (res) => {
      // Dacă userul nu este logat, mergem la pagina de login
      if (!res?.accessToken) {
        navigate("/");
      } else {
        setLoading(false);
      }
    });
  }, []);

  return loading ? <Loader /> : <MessagesComponent currentUser={currentUser} />;
}
