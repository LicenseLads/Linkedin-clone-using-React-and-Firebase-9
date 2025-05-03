import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./index.scss";
import { toast } from "react-toastify";
import { postProject, updateProjectById, getProjectById } from "../../../api/FirestoreAPI";
import { useNavigate } from "react-router-dom";

export const ProjectForm = ({ currentUserId }) => {
  console.log(currentUserId)

  const { projectId } = useParams();
  const [projectData, setProjectData] = useState({
    name: "",
    url: "",
    description: "",
    label: "",
    status: "",
    has_github_repository: false,
    image: ""
  });

  useEffect(() => {
    if (projectId) {
      getProjectById(projectId).then((data) => {
        setProjectData(data);
      }).catch((error) => {
        console.error("Error fetching project data: ", error);
      });
    }
  }, [projectId]);


  const navigate = useNavigate();

  const triggerToastValidationError = (errorMessage) => {
    toast.error(errorMessage);
    return false;
  };

  const validateForm = () => {
    if (projectData.name === "")
      return triggerToastValidationError("Project name cannot be empty.");
    if (projectData.url === "")
      return triggerToastValidationError("Project URL cannot be empty.");
    if (projectData.description.length < 80)
      return triggerToastValidationError(
        "Project description must have at least 80 characters."
      );
    if (projectData.label === "") return triggerToastValidationError("Project must be assigned to a label.");
    if (projectData.status === "") return triggerToastValidationError("Project must have an assigned status"); 

    return true;
  };

  const submitForm = async (e) => {
    e.preventDefault(); 

    if (validateForm()) {
        const projectEntry = {
            name: projectData.name,
            url: projectData.url,
            label: projectData.label,
            status: projectData.status,
            description: projectData.description,
            has_github_repository: projectData.has_github_repository,
            image: projectData.image,
            author: currentUserId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        if (projectId) {
          updateProjectById(projectId, projectEntry).then(() => {
            setTimeout(() => {
              navigate("/home");
            }, 500);
          }).catch((error) => {
            toast.error("Error updating project: " + error.message);
          });
        } else {
          postProject(projectEntry, () => {
            setTimeout(() => {
              navigate("/home");
            }, 500);
          });
        }
    }
  }

  return (
    <div className="project-form-wrapper">
      <form onSubmit={submitForm} className="project-form">
        <div className="form-title">
        <h1 style={{ color: "#232D3F" }}>
          Add a project to your project feed!
        </h1>
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
            value={projectData.name}
            onChange={(e) => setProjectData({...projectData, name: e.target.value})}
            className="form-text-input"
            type="text"
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Project URL </label>
          <input
            value={projectData.url}
            onChange={(e) => setProjectData({...projectData, url: e.target.value})}
            className="form-url-input"
            type="url"
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Description </label>
          <textarea
            value={projectData.description}
            onChange={(e) => setProjectData({...projectData, description: e.target.value})}
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Label </label>
          <div className="form-entry-checkbox-row">
            <div className="form-entry-col">
              <label className="form-label"> Web App </label>
              <input
                checked={projectData.label === "web_app"}
                onChange={(e) => setProjectData({...projectData, label: "web_app"})}
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> Research Project </label>
              <input
                checked={projectData.label === "research_project"}
                onChange={(e) => setProjectData({...projectData, label: "research_project"})}
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> AI Project </label>
              <input
                checked={projectData.label === "ai_project"}
                onChange={(e) => setProjectData({...projectData, label: "ai_project"})}
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> Other </label>
              <input
                checked={projectData.label === "other"}
                onChange={(e) => setProjectData({...projectData, label: "other"})}
                className="form-checkbox"
                type="checkbox"
              />
            </div>
          </div>
        </div>
        <div className="form-entry-col">
          <label className="form-label"> GitHub Repository </label>
          <input
            checked={projectData.has_github_repository}
            onChange={(event) => setProjectData({...projectData, has_github_repository: event.target.checked})}
            disabled={projectData.url.length === 0}
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
                checked={projectData.status === "done"}
                onChange={(e) => setProjectData({...projectData, status: "done"})}
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> In progress </label>
              <input
                checked={projectData.status === "in_progress"}
                onChange={(e) => setProjectData({...projectData, status: "in_progress"})}
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
