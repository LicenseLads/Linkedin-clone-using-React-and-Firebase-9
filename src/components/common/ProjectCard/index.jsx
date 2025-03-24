// ProjectCard.jsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../../assets/user.png";
import "./index.scss";

export default function ProjectCard({
  id,
  name,
  description,
  author,
  createdAt,
  updatedAt,
}) {
  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState(null);

  useEffect(() => {
    if (!author) return;
    const fetchAuthor = async () => {
      try {
        const docRef = doc(firestore, "users", author);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setAuthorData({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Eroare la încărcarea autorului:", err);
      }
    };
    fetchAuthor();
  }, [author]);

  const goToProject = () => {
    navigate(`/view-project/${id}`);
  };

  const goToAuthorProfile = (e) => {
    e.stopPropagation();
    if (!authorData?.id || !authorData?.email) return;
    navigate("/profile", {
      state: {
        id: authorData.id,
        email: authorData.email,
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleString("ro-RO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const finalDate = updatedAt || createdAt;

  return (
    <div className="project-card-container" onClick={goToProject}>
      <div className="project-card-header">
        <div className="project-author-info" onClick={goToAuthorProfile}>
          <img
            src={authorData?.imageLink || defaultImg}
            alt="Author"
            className="project-author-avatar"
          />
          <span className="project-author-name">
            {authorData?.name || "Autor necunoscut"}
          </span>
        </div>
        <span className="project-date">{formatDate(finalDate)}</span>
      </div>

      <h2 className="project-title">{name}</h2>
      <p className="project-description">{description}</p>
    </div>
  );
}
