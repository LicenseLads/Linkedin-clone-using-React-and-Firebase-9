import React, { useMemo, useState } from "react";
import {
  likePost,
  isPostLikedByUser,
  getLikesCount,
  getLikesByUser,
  postComment,
  getComments,
} from "../../../api/FirestoreAPI";
import { getCurrentTimeStamp } from "../../../helpers/useMoment";
import "./index.scss";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { BsFillHandThumbsUpFill, BsHandThumbsUp } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LikeButton({ userId, postId, currentUser }) {
  const [likesCount, setLikesCount] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getLikesByUser(userId, postId, setLiked, setLikesCount);
    getComments(postId, setComments);
  }, [userId, postId]);

  const handleLike = async () => {
    if (isProcessingLike) return;
    setIsProcessingLike(true);

    try {
      const currentLiked = await isPostLikedByUser(userId, postId);

      await likePost(userId, postId, currentLiked); // adaugă sau șterge în funcție de stare reală

      const updatedLiked = await isPostLikedByUser(userId, postId); // revalidare
      const updatedCount = await getLikesCount(postId); // actualizare count

      setLiked(updatedLiked);
      setLikesCount(updatedCount);
    } catch (err) {
      console.error("Eroare la like:", err);
    } finally {
      setIsProcessingLike(false);
    }
  };

  const getComment = (event) => {
    setComment(event.target.value);
  };

  const addComment = () => {
    postComment({
      postId,
      comment,
      timeStamp: getCurrentTimeStamp("LLL"),
      name: currentUser?.name,
      authorId: currentUser?.id, // sau userId dacă e corect
    });
    setComment("");
  };
  useMemo(() => {
    getLikesByUser(userId, postId, setLiked, setLikesCount);
    getComments(postId, setComments);
  }, [userId, postId]);
  return (
    <div className="like-container">
      <p>{likesCount} Aprecieri</p>
      <div className="hr-line">
        <hr />
      </div>
      <div className="like-comment">
        <div className="likes-comment-inner" onClick={handleLike}>
          {liked ? (
            <BsFillHandThumbsUpFill size={30} color="#0a66c2" />
          ) : (
            <BsHandThumbsUp size={30} />
          )}

          <p className={liked ? "blue" : "black"}>Like</p>
        </div>
        <div
          className="likes-comment-inner"
          onClick={() => setShowCommentBox(!showCommentBox)}
        >
          {
            <AiOutlineComment
              size={30}
              color={showCommentBox ? "#0a66c2" : "#212121"}
            />
          }

          <p className={showCommentBox ? "blue" : "black"}>Recenzii</p>
        </div>
      </div>
      {showCommentBox ? (
        <>
          <input
            onChange={getComment}
            placeholder="Adaugă comentariu"
            className="comment-input"
            name="comment"
            value={comment}
          />
          <button className="add-comment-btn" onClick={addComment}>
            Adauga comentariu
          </button>

          {comments.length > 0 ? (
            comments.map((comment) => {
              return (
                <div className="all-comments">
                  <p
                    className="name cursor-pointer hover:underline"
                    onClick={() => navigate(`/profile?id=${comment.authorId}`)}
                  >
                    {comment.name}
                  </p>

                  <p className="comment">{comment.comment}</p>

                  <p className="timestamp">{comment.timeStamp}</p>
                  {/* 
                  <p>•</p>
                   */}
                </div>
              );
            })
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
