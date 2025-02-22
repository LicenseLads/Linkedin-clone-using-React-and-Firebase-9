import "./index.scss";
import img from "../../../assets/user.png";

export default function ProjectCard({
  id,
  name,
  description,
  author,
  createdAt,
  updatedAt,
}) {
  return (
    <div className="project-card-container">
      <div className="project-card-top">
        <div className="project-card-top-title">
          <div className="project-card-top-image-wrapper">
            <img alt={name} src={img} />
          </div>
          <h1>
            {name}
          </h1>
        </div>
        <div className="project-card-right-labels">
            <div>{author}</div>
            <div>{createdAt}</div>
        </div>
      </div>
      <div className="project-card-description">
        {description}
      </div>
    </div>
  );
}
