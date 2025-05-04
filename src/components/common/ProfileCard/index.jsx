import React, { useState, useMemo, useEffect } from "react";
import {
  getConnectionCountPerUser,
  getPostsCountPerUser,
  getProjects,
  getProjectsCountPerUser,
  getSingleStatus,
  getSingleUser,
} from "../../../api/FirestoreAPI";
import PostsCard from "../PostsCard";
import { HiOutlinePencil } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import FileUploadModal from "../FileUploadModal";
import { uploadImage as uploadImageAPI } from "../../../api/ImageUpload";
import "./index.scss";
import CategorySwitch from "../CategorySwitch";
import ProjectCardList from "../ProjectCardList";
import { getConnections, addConnection } from "../../../api/FirestoreAPI";
import { useNavigate } from "react-router-dom";

export default function ProfileCard({ onEdit, currentUser }) {
  let location = useLocation();
  const [allStatuses, setAllStatus] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [collection, setCollection] = useState("posts");
  const [userConnectionsCount, setConnectionsCount] = useState("N/A");
  const [userPostsCount, setUserPostsCount] = useState("N/A");
  const [userProjectsCount, setUserProjectsCount] = useState("N/A");
  const [userProfileAverage, setUserProfileAverage] = useState("N/A");
  const [currentProfile, setCurrentProfile] = useState({});
  const [currentImage, setCurrentImage] = useState({});
  const [progress, setProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const profileId = location?.state?.id ?? currentUser.id;

  const getImage = (event) => {
    setCurrentImage(event.target.files[0]);
  };
  const uploadImage = () => {
    uploadImageAPI(
      currentImage,
      currentUser.id,
      setModalOpen,
      setProgress,
      setCurrentImage
    );
  };

  useEffect(() => {
    if (currentUser?.id === undefined) return;

    getSingleStatus(setAllStatus, currentUser?.id);

    if (currentUser?.email === undefined) return;

    if (currentUser?.email) {
      getSingleUser(setCurrentProfile, currentUser?.email);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.id && profileId) {
      getConnections(currentUser.id, profileId, setIsConnected);
    }
  }, [currentUser?.id, profileId]);

  useEffect(() => {
    if (currentUser?.id === undefined) return;

    if (collection === "projects") {
      getProjects(setAllProjects, currentUser?.id);
      setAllStatus([]);
    } else if (collection === "posts") {
      getSingleStatus(setAllStatus, currentUser?.id);
      setAllProjects([]);
    }
  }, [collection, currentUser?.id]);

  useEffect(() => {
    console.log("call");
    if (currentUser.id === undefined) return;
    getConnectionCountPerUser(setConnectionsCount, currentUser?.id);
    getPostsCountPerUser(setUserPostsCount, currentUser?.id);

    if (currentUser.accountType === "student") {
      getProjectsCountPerUser(setUserProjectsCount, currentUser?.id);
      // setUserProfileAverage(currentUser?.profileAverage);
    }
  }, [currentUser]);

  return (
    <div className="profile-card-wrapper">
      <FileUploadModal
        getImage={getImage}
        uploadImage={uploadImage}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        currentImage={currentImage}
        progress={progress}
      />
      <div className="profile-card">
        {currentUser.id === location?.state?.id && (
          <div className="edit-btn">
            <HiOutlinePencil className="edit-icon" onClick={onEdit} />
          </div>
        )}
        <div className="profile-info">
          <div className="left-info">
            <div className="profile-avatar-section">
              <img
                className="profile-image"
                onClick={() => setModalOpen(true)}
                src={
                  Object.values(currentProfile).length === 0
                    ? currentUser.imageLink
                    : currentProfile?.imageLink
                }
                alt="Imagine profil"
              />
              <h3 className="userName">
                {Object.values(currentProfile).length === 0
                  ? currentUser.name
                  : currentProfile?.name}
              </h3>
            </div>

            <div className="middle-section">
              <div className="stat">
                <div className="stat-number">{userConnectionsCount}</div>
                <div className="stat-label">Conexiuni</div>
              </div>
              <div className="stat">
                <div className="stat-number">{userPostsCount}</div>
                <div className="stat-label">Postări</div>
              </div>
              {currentUser.accountType === "student" && (
                <>
                  <div className="stat">
                    <div className="stat-number">{userProjectsCount}</div>
                    <div className="stat-label">Proiecte</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">{userProfileAverage}</div>
                    <div className="stat-label">Medie profil</div>
                  </div>
                </>
              )}
            </div>

            <p className="heading">
              {Object.values(currentProfile).length === 0
                ? currentUser.accountType
                : currentProfile?.accountType}
            </p>

            <p className="location">
              {Object.values(currentProfile).length === 0
                ? `${currentUser.city}, ${currentUser.country}`
                : `${currentProfile?.city}, ${currentProfile?.country}`}
            </p>

            {currentUser.website || currentProfile?.website ? (
              <a
                className="website"
                target="_blank"
                href={
                  Object.values(currentProfile).length === 0
                    ? currentUser.website
                    : currentProfile?.website
                }
              >
                {Object.values(currentProfile).length === 0
                  ? currentUser.website
                  : currentProfile?.website}
              </a>
            ) : null}
          </div>

          <div className="right-info">
            <p className="college">
              <strong>Facultate:</strong>{" "}
              {Object.values(currentProfile).length === 0
                ? currentUser.college
                : currentProfile?.college}
            </p>
            <p className="company">
              <strong>Companie:</strong>{" "}
              {Object.values(currentProfile).length === 0
                ? currentUser.company
                : currentProfile?.company}
            </p>
            {/* <p className="field">
              <strong>Câmp:</strong>{" "}
              {Object.values(currentProfile).length === 0
                ? currentUser.field
                : currentProfile?.field}
            </p> */}
          </div>
        </div>

        {currentUser.id !== profileId && (
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            {!isConnected ? (
              <button
                className="connect-button"
                onClick={() => addConnection(currentUser.id, profileId)}
              >
                Adaugă conexiune
              </button>
            ) : (
              <button
                className="chat-button"
                onClick={() =>
                  navigate("/messages", {
                    state: { selectedUserId: profileId },
                  })
                }
              >
                Trimite mesaj
              </button>
            )}
          </div>
        )}

        {currentUser.about || currentProfile?.about ? (
          <p className="about-me">
            <strong>Despre mine:</strong> &nbsp;
            {Object.values(currentProfile).length === 0
              ? currentUser.about
              : currentProfile?.about}
          </p>
        ) : null}

        {currentUser.skills || currentProfile?.skills ? (
          <p className="skills">
            <span className="skill-label">Abilitati:</span> &nbsp;
            {Object.values(currentProfile).length === 0
              ? currentUser.skills
              : currentProfile?.skills}
          </p>
        ) : null}
      </div>

      {currentUser?.accountType === "student" ? (
        <CategorySwitch
          activeOption={collection}
          setActiveOption={setCollection}
        />
      ) : null}

      {collection === "posts" ? (
        <div className="post-status-main">
          {allStatuses?.map((posts) => {
            return (
              <div key={posts.id}>
                <PostsCard posts={posts} />
              </div>
            );
          })}
        </div>
      ) : null}

      {collection === "projects" ? (
        <div className="post-status-main">
          <ProjectCardList projects={allProjects} />
        </div>
      ) : null}

      <div style={{ height: "100px", width: "100px" }}> </div>
    </div>
  );
}
