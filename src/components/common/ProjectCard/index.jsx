import "./index.scss";
import img from "../../../assets/user.png";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({
  id,
  name,
  description,
  author,
  createdAt,
  updatedAt,
}) {
  const navigate = useNavigate();
  
  return (
    <div onClick={() => navigate(`/view-project/${id}`)} className="project-card-container">
      <div className="project-card-top">
        <div className="project-card-top-title">
          <div className="project-card-top-image-wrapper">
            <img alt={name} src={img} />
          </div>
          <h1>{name}</h1>
        </div>
        <div className="project-card-right-labels">
          <div>{author}</div>
          <div>{updatedAt === undefined ? createdAt : updatedAt}</div>
        </div>
      </div>
      <div className="project-card-description">{description}</div>
    </div>
  );
}
