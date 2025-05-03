import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./index.scss";
import { toast } from "react-toastify";
import {
  postProject,
  updateProjectById,
  getProjectById,
} from "../../../api/FirestoreAPI";
import { useNavigate } from "react-router-dom";

export const ProjectForm = ({ currentUserId }) => {
  console.log(currentUserId);

  const { projectId } = useParams();
  const [projectData, setProjectData] = useState({
    name: "",
    url: "",
    description: "",
    label: "",
    status: "",
    has_github_repository: false,
    image: "",
  });

  useEffect(() => {
    if (projectId) {
      getProjectById(projectId)
        .then((data) => {
          setProjectData(data);
        })
        .catch((error) => {
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
    if (projectData.label === "")
      return triggerToastValidationError(
        "Project must be assigned to a label."
      );
    if (projectData.status === "")
      return triggerToastValidationError(
        "Project must have an assigned status"
      );

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
        updated_at: new Date().toISOString(),
      };
      if (projectId) {
        updateProjectById(projectId, projectEntry)
          .then(() => {
            setTimeout(() => {
              navigate("/home");
            }, 500);
          })
          .catch((error) => {
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
  };

  return (
    <div className="project-form-wrapper">
      <form onSubmit={submitForm} className="project-form">
        <div className="form-title">
          <h1 style={{ color: "#232D3F" }}>
            Adaugă un proiect în feed-ul tău!
          </h1>
          <p>
            Încarcă-ți proiectul pentru ca întreaga lume să-l vadă! Poți adăuga
            un link GitHub pentru a-l prezenta, sau o referință externă dacă
            proiectul tău este găzduit pe web.
          </p>
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Nume proiect </label>
          <input
            value={projectData.name}
            onChange={(e) =>
              setProjectData({ ...projectData, name: e.target.value })
            }
            className="form-text-input"
            type="text"
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> URL proiect </label>
          <input
            value={projectData.url}
            onChange={(e) =>
              setProjectData({ ...projectData, url: e.target.value })
            }
            className="form-url-input"
            type="url"
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Descriere </label>
          <textarea
            value={projectData.description}
            onChange={(e) =>
              setProjectData({ ...projectData, description: e.target.value })
            }
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Etichetă </label>
          <div className="form-entry-checkbox-row">
            <div className="form-entry-col">
              <label className="form-label"> Aplicație Web </label>
              <input
                checked={projectData.label === "web_app"}
                onChange={() =>
                  setProjectData({ ...projectData, label: "web_app" })
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> Proiect de cercetare </label>
              <input
                checked={projectData.label === "research_project"}
                onChange={() =>
                  setProjectData({ ...projectData, label: "research_project" })
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> Proiect AI </label>
              <input
                checked={projectData.label === "ai_project"}
                onChange={() =>
                  setProjectData({ ...projectData, label: "ai_project" })
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> Altul </label>
              <input
                checked={projectData.label === "other"}
                onChange={() =>
                  setProjectData({ ...projectData, label: "other" })
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
          </div>
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Repositoriu GitHub </label>
          <input
            checked={projectData.has_github_repository}
            onChange={(e) =>
              setProjectData({
                ...projectData,
                has_github_repository: e.target.checked,
              })
            }
            disabled={projectData.url.length === 0}
            className="form-checkbox"
            type="checkbox"
          />
        </div>
        <div className="form-entry-col">
          <label className="form-label"> Stare curentă </label>
          <div className="form-entry-checkbox-row">
            <div className="form-entry-col">
              <label className="form-label"> Finalizat </label>
              <input
                checked={projectData.status === "done"}
                onChange={() =>
                  setProjectData({ ...projectData, status: "done" })
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
            <div className="form-entry-col">
              <label className="form-label"> În curs </label>
              <input
                checked={projectData.status === "in_progress"}
                onChange={() =>
                  setProjectData({ ...projectData, status: "in_progress" })
                }
                className="form-checkbox"
                type="checkbox"
              />
            </div>
          </div>
        </div>
        <div className="form-submit-row">
          <button type="submit" className="form-submit-button">
            Trimite
          </button>
        </div>
      </form>
    </div>
  );
};
