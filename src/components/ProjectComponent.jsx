import "../Sass/ProjectComponent.scss";
import { ProjectForm } from "./common/ProjectForm";
import ProjectView from "./common/ProjectView";

export default function ProjectComponent ({ type, userId, userName }) {
    const renderProjectComponent = () => {
        switch(type) {
            case "add":
                return <ProjectForm currentUserId={userId} entryId={null} />
            case "edit":
                return <ProjectForm currentUserId={userId} entryId={type} />
            case "view":
                return <ProjectView currentUserName={userName} currentUserId={userId} entryId={type} />
        }
    }

    return <div className="project-component">
        {renderProjectComponent()}
    </div>
}