import React, { useState, useMemo, useEffect } from "react";
import {
  postStatus,
  getStatus,
  updatePost,
  getUserConnections,
  getFeedProjects,
} from "../../../api/FirestoreAPI";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import ModalComponent from "../Modal";
import { uploadPostImage } from "../../../api/ImageUpload";
import { getUniqueID } from "../../../helpers/getUniqueId";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../ProjectCard";

export default function ProjectFeed({ currentUser }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [userConnections, setUserConnections] = useState([]);
  const [feedProjects, setFeedProjects] = useState([]);
  const [currentPost, setCurrentPost] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [postImage, setPostImage] = useState("");

  const navigate = useNavigate();

  const goToRoute = (route) => {
    navigate(route);
  };

  const sendStatus = async () => {
    let object = {
      status: status,
      timeStamp: getCurrentTimeStamp("LLL"),
      userEmail: currentUser.email,
      userName: currentUser.name,
      postID: getUniqueID(),
      userID: currentUser.id,
      postImage: postImage,
    };
    postStatus(object);
    setModalOpen(false);
    setIsEdit(false);
    setStatus("");
  };

  const getEditData = (posts) => {
    setModalOpen(true);
    setStatus(posts?.status);
    setCurrentPost(posts);
    setIsEdit(true);
  };

  const updateStatus = () => {
    updatePost(currentPost.id, status, postImage);
    setModalOpen(false);
  };

  useEffect(() => {
    if (currentUser.id !== undefined) {
      getUserConnections(setUserConnections, currentUser?.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (userConnections.length === 0) return;
    getFeedProjects(setFeedProjects, userConnections);
  }, [userConnections]);

  return (
    <div className="project-feed-main">
      <div className="user-details">
        <img src={currentUser?.imageLink} alt="imageLink" />
        <p className="name">{currentUser?.name}</p>
        <p className="headline">{currentUser?.headline}</p>
      </div>
      <div className="project-status">
        <img
          className="project-image"
          src={currentUser?.imageLink}
          alt="imageLink"
        />
        <button
          className="open-project-modal"
          onClick={() => {
            goToRoute("/add-project");
          }}
        >
          Create a Project
        </button>
      </div>

      <ModalComponent
        setStatus={setStatus}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        status={status}
        sendStatus={sendStatus}
        isEdit={isEdit}
        updateStatus={updateStatus}
        uploadPostImage={uploadPostImage}
        postImage={postImage}
        setPostImage={setPostImage}
        setCurrentPost={setCurrentPost}
        currentPost={currentPost}
      />

      <div className="projects-feed">
        {feedProjects.map((project) => {
          return (
            <div key={project.id}>
              <ProjectCard
                id={project.id}
                name={project.name}
                description={project.description}
                author={project.author}
                createdAt={project.created_at}
                updatedAt={project.updated_at}
              />
              <div className="projects-feed-spacer" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
