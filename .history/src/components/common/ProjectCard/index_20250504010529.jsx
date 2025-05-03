// ProjectCard.jsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../../assets/user.png";
import { FaRegCopy, FaMarker } from "react-icons/fa"
import "./index.scss";

export default function ProjectCard({
  id,
  name,
  description,
  author,
  createdAt,
  updatedAt,
  status,
  label
}) {
  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState(null);

  const projectLabelToText = {
    "done": "Done",
    "in_progress": "In Progress"
  }

  const labelToLabelEntry = {
    "web_app": {
      name: "Web App",
      color: "blue"
    },
    "research_project": {
      name: "Research Project",
      color: "purple"
    },
    "ai_project": {
      name: "AI Project",
      color: "indigo"
    },
    "other": {
      name: "other",
      color: "grey"
    }
  }

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
      <div className="project-card-header-row">
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
        <span className="status-label">{projectLabelToText[status]}</span>
      </div>

      <h2 className="project-title">{name}</h2>
      <p className="project-description">
        {description}
      </p>
      <div className="project-card-footer-row">
        <div className="project-card-footer-item">
          <span style={{ backgroundColor: labelToLabelEntry[label]?.color}} className="label">
          {labelToLabelEntry[label]?.name}
          </span>
        </div>
        <div className="project-card-footer-item">
          <div className="footer-displays-row">
            <span className="action-icon">
              <FaRegCopy height={10} width={10} />
            </span>
            <span className="action-icon">
              <FaMarker height={10} width={10} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
