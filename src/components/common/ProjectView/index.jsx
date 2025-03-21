import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "./index.scss";
import { firestore } from "../../../firebaseConfig";
import CommentsScrollSection from "../CommentsScrollSection";
import { getCommentsForProject } from "../../../api/FirestoreAPI";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatLabel = (label) => {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Extracts the repository slug ("username/repo") from a GitHub URL.
 * Returns an empty string if parsing fails.
 */
const getRepoSlug = (url) => {
  try {
    const parsedUrl = new URL(url);
    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return parts.slice(0, 2).join("/");
    }
    return "";
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
    return "";
  }
};

const ProjectView = ({ currentUserId, currentUserName }) => {
  const [visibleComments, setVisibleComments] = useState(10);
  const [comments, setComments] = useState([]);

  const showMoreComments = () => {
    setVisibleComments((prevVisibleComments) => prevVisibleComments + 10);
  };
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [repoData, setRepoData] = useState(null);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(firestore, "projects", projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          console.error("No such project!");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoadingProject(false);
      }
    };
    if (projectId) {
      fetchProject();
    } else {
      setLoadingProject(false);
    }
  }, [projectId]);

  // Fetch GitHub repository data if applicable
  useEffect(() => {
    const fetchRepoData = async () => {
      if (project && project.has_github_repository && project.url) {
        const repoSlug = getRepoSlug(project.url);
        if (repoSlug) {
          setLoadingRepo(true);
          try {
            const response = await fetch(
              `https://api.github.com/repos/${repoSlug}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setRepoData(data);
          } catch (error) {
            console.error("Error fetching repository data:", error);
          } finally {
            setLoadingRepo(false);
          }
        }
      }
    };
    fetchRepoData();
  }, [project]);

  useMemo(() => {
    getCommentsForProject(setComments, projectId);
  }, [])

  if (loadingProject) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const displayDate = project.updated_at
    ? formatDate(project.updated_at)
    : formatDate(project.created_at);

  return (
    <div className="project-view-wrapper">
      <div className="project-view">
        <div
          className="card-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="date-info">{displayDate}</div>
          {currentUserId === project.author && (
            <button
              className="edit-button"
              onClick={() => navigate(`/edit-project/${projectId}`)}
            >
              Edit
            </button>
          )}
        </div>
        {project.image && project.image !== "" && (
          <img
            src={project.image}
            alt={project.name}
            className="project-view-image"
          />
        )}
        <h2 className="project-view-title">{project.name}</h2>
        {project.description && (
          <p className="project-view-description">{project.description}</p>
        )}
        <div className="project-view-meta">
          {(project.status || project.label) && (
            <div className="pill-row">
              {project.status && (
                <div className="info-cell status-cell">
                  {project.status === "done"
                    ? "Done"
                    : project.status === "in_progress"
                    ? "In Progress"
                    : project.status}
                </div>
              )}
              {project.label && (
                <div className="info-cell label-cell">
                  {formatLabel(project.label)}
                </div>
              )}
            </div>
          )}
          {project.url &&
            (project.has_github_repository ? (
              <div className="github-card">
                {loadingRepo ? (
                  <p>Loading repository data...</p>
                ) : repoData ? (
                  <>
                    <div className="github-card-header">
                      <h3 className="github-card-title">
                        {repoData.full_name}
                      </h3>
                    </div>
                    <p className="github-card-description">
                      {repoData.description}
                    </p>
                    <div className="github-card-footer">
                      <span>⭐ {repoData.stargazers_count}</span>
                      <span>Forks: {repoData.forks_count}</span>
                      {repoData.language && (
                        <span>Language: {repoData.language}</span>
                      )}
                    </div>
                    <a
                      href={repoData.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub
                    </a>
                  </>
                ) : (
                  <p>
                    Project URL:{" "}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.url}
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <div className="github-card">
                <p>
                  Project URL:{" "}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.url}
                  </a>
                </p>
              </div>
            ))}
        </div>
      </div>
      <CommentsScrollSection
        entryId={projectId}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        comments={comments}
        visibleComments={visibleComments}
        showMoreComments={showMoreComments}
      />
      <div className="projects-feed-spacer" />
    </div>
  );
};

export default ProjectView;
