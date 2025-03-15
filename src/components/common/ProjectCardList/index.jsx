import ProjectCard from "../ProjectCard";
import "./index.scss";

export default function ProjectCardList({ projects }) {
  return (
    <div className="project-card-list">
      {projects.map((project) => (
        <ProjectCard
          id={project.id}
          key={project.id}
          name={project.name}
          author={project.author}
          createdAt={project.created_at}
          description={project.description}
        />
      ))}
    </div>
  );
}
