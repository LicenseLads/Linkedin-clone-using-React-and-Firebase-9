import { useRef, useEffect, useState } from "react";
import "./index.scss";
import { toast } from "react-toastify";
import { postComment } from "../../../api/FirestoreAPI";

const CommentsScrollSection = ({
  comments,
  entryId,
  currentUserName,
  visibleComments,
  showMoreComments,
}) => {
  const scrollRef = useRef(null);
  const [commentInput, setCommentInput] = useState("");

  const addComment = async () => {
    if (!commentInput || commentInput === "") return toast.error("You can't post an empty comment");

    const commentEntry = {
        "comment": commentInput,
        "name": currentUserName,
        "projectId": entryId,
        "timeStamp": new Date()
    }

    postComment(commentEntry);
    setCommentInput("");
  }

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = (event) => {
      const { scrollTop, scrollHeight, clientHeight } = element;

      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;

      if ((isAtTop && event.deltaY < 0) || (isAtBottom && event.deltaY > 0)) {
        event.preventDefault();
      }
    };

    element.addEventListener("wheel", handleScroll, { passive: false });

    return () => element.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <>
      <h3>Comments</h3>
      <div ref={scrollRef} className="comment-section">
        {comments.length === 0 ? (
          <p>No comments for this post.</p>
        ) : (
          comments.slice(0, visibleComments).map((comment, index) => (
            <div key={index} className="comment">
              <p>
                <strong>{comment.name}:</strong> {comment.comment}
              </p>
            </div>
          ))
        )}
        {visibleComments < comments.length && (
          <button onClick={showMoreComments}>Show More</button>
        )}
      </div>
      <input
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        placeholder="Add a Comment"
        className="comment-input"
        name="comment"
      />
      <div className="comment-button-container">
        <button className="comment-button" onClick={addComment}>Add Comment</button>
      </div>
    </>
  );
};

export default CommentsScrollSection;
