import { useState } from "react";
import "./index.scss";
import { toast } from "react-toastify";
import { postProject } from "../../../api/FirestoreAPI";
import { useNavigate } from "react-router-dom";

export const ProjectForm = ({ entryId, currentUserId }) => {
  const [projectName, setProjectName] = useState("");
  const [projectURL, setProjectURL] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectLabel, setProjectLabel] = useState("");
  const [hasGithubRepository, setHasGithubRepository] = useState(false);

  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const changeProjectType = (type, checked) => {
    if (checked) setProjectType(type);
  };

  const changeProjectLabel = (label, checked) => {
    if (checked) setProjectLabel(label);
  };

  const triggerToastValidationError = (errorMessage) => {
    toast.error(errorMessage);
    return false;
  };

  const validateForm = () => {
    if (projectName === "")
      return triggerToastValidationError("Project name cannot be empty.");
    if (projectURL === "")
      return triggerToastValidationError("Project URL cannot be empty.");
    if (projectDescription.length < 80)
      return triggerToastValidationError(
        "Project description must have at least 80 characters."
      );
    if (projectLabel === "") return triggerToastValidationError("Project must be assigned to a label.");
    if (projectType === "") return triggerToastValidationError("Project must have an assigned status"); 

    return true;
  };

  const submitForm = async (e) => {
    e.preventDefault(); 

    if (validateForm()) {
        const projectEntry = {
            name: projectName,
            url: projectURL,
            label: projectLabel,
            status: projectType,
            description: projectDescription,
            has_github_repository: hasGithubRepository,
            image: image,
            author: currentUserId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
       postProject(projectEntry, () => {
        toast.success("Project uploaded successfully!");
        setTimeout(() => {
            navigate("/home");
        }, 500)
       })
    }
  }

  return (
    <div className="project-form-wrapper">
      <form onSubmit={submitForm} className="project-form">
        <div className="form-title">
          <h1> Add a project to your project feed! </h1>
          <p>
            Upload your project for the world to see! You can add an online
            reference to showcase your project via a GitHub link. You can also
            attach an external reference of your project if it is uploaded on
            the web!
          </p>
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Name </label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="form-text-input"
            type="text"
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Project URL </label>
          <input
            value={projectURL}
            onChange={(e) => setProjectURL(e.target.value)}
            className="form-url-input"
            type="url"
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Description </label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Label </label>
          <div className="form-entry-checkbox-row">
            <div className="form-entry-col">
              <label className="form-label"> Web App </label>
              <input
                checked={projectLabel === "web_app"}
                onChange={(e) =>
                  changeProjectLabel("web_app", e.target.checked)
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> Research Project </label>
              <input
                checked={projectLabel === "research_project"}
                onChange={(e) =>
                  changeProjectLabel("research_project", e.target.checked)
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> AI Project </label>
              <input
                checked={projectLabel === "ai_project"}
                onChange={(e) =>
                  changeProjectLabel("ai_project", e.target.checked)
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> Other </label>
              <input
                checked={projectLabel === "other"}
                onChange={(e) => changeProjectLabel("other", e.target.checked)}
                className="form-checkbox"
                type="checkbox"
              />
            </div>
          </div>
        </div>
        <div className="form-entry-col">
          <label className="form-label"> GitHub Repository </label>
          <input
            onChange={(event) => setHasGithubRepository(event.target.checked)}
            disabled={projectURL.length === 0}
            className="form-checkbox"
            type="checkbox"
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Current Status </label>
          <div className="form-entry-checkbox-row">
            <div className="form-entry-col">
              <label className="form-label"> Done </label>
              <input
                checked={projectType === "done"}
                onChange={(e) => changeProjectType("done", e.target.checked)}
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> In progress </label>
              <input
                checked={projectType === "in_progress"}
                onChange={(e) =>
                  changeProjectType("in_progress", e.target.checked)
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
          </div>
        </div>
        <div className="form-submit-row">
          <button type="submit" className="form-submit-button">Submit</button>
        </div>
      </form>
    </div>
  );
};
