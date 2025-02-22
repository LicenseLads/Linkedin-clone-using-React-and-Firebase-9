import "../Sass/ProjectComponent.scss";
import { ProjectForm } from "./common/ProjectForm";

export default function ProjectComponent ({ type, userId }) {
    const renderProjectComponent = () => {
        switch(type) {
            case "add":
                return <ProjectForm currentUserId={userId} entryId={null} />
            case "edit":
                return <ProjectForm entryId={type} />
            case "view":
                return <ProjectForm entryId={type} />
        }
    }

    return <div className="project-component">
        {renderProjectComponent()}
    </div>
}