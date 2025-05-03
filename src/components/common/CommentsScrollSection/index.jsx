import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteComment,
  getCommentsByProjectAndUser,
  postComment,
  updateComment,
} from "../../../api/FirestoreAPI";
import "./index.scss";
import defaultUserImage from '../../../assets/user.png';



const formatDate = (timestamp) => {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CommentsScrollSection = ({
  comments,
  entryId,
  currentUserId,
  currentUserName,
  currentUserRole,
  visibleComments,
  showMoreComments,
}) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [commentInput, setCommentInput] = useState("");
  const [ratingInput, setRatingInput] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const checkExistingReview = async () => {
      if (currentUserRole === "teacher") {
        const existing = await getCommentsByProjectAndUser(entryId, currentUserName);
        if (existing.length > 0) {
          setExistingReview(existing[0]);
          setHasReview(true);
          setCommentInput(existing[0].comment); // populare automată
          setRatingInput(existing[0].rating.toString());
          setIsEditing(true); // activează automat formularul de editare
        } else {
          setHasReview(false);
          setIsEditing(false);
        }
      }
    };
    checkExistingReview();
  }, [entryId, currentUserName, currentUserRole]);
  

  const handleAddOrUpdateComment = async () => {
    if (currentUserRole !== "teacher") {
      toast.error("Doar profesorii pot posta recenzii.");
      return;
    }

    if (!commentInput || !ratingInput) {
      toast.error("Comentariul și nota sunt obligatorii.");
      return;
    }

    const ratingValue = parseInt(ratingInput);
    if (ratingValue < 1 || ratingValue > 10) {
      toast.error("Nota trebuie să fie între 1 și 10.");
      return;
    }

    try {
      const existing = await getCommentsByProjectAndUser(
        entryId,
        currentUserName
      );
      if (existing.length > 0 && !isEditing) {
        toast.error("Ai adăugat deja o recenzie pentru acest proiect.");
        return;
      }

      const commentEntry = {
        comment: commentInput,
        name: currentUserName,
        projectId: entryId,
        authorId: currentUserId ,
        timeStamp: new Date(),
        rating: ratingValue,
        photoURL: currentUserPhotoURL,
      };

      if (isEditing && existingReview) {
        await updateComment(existingReview.id, commentEntry);
        toast.success("Recenzia a fost actualizată.");
        setHasReview(true);
      } else {
        await postComment(commentEntry);
        setHasReview(true);
        toast.success("Recenzia a fost adăugată.");
      }

      setCommentInput("");
      setRatingInput("");
      setIsEditing(false);
    } catch (error) {
      toast.error("A apărut o eroare. Vă rugăm să încercați din nou.");
    }
  };

  const handleEdit = (comment) => {
    setCommentInput(comment.comment);
    setRatingInput(comment.rating.toString());
    setIsEditing(true);
    setExistingReview(comment); // setează recenzia selectată pentru update
  };

  const handleDelete = async () => {
    if (existingReview) {
      try {
        await deleteComment(existingReview.id);
        setExistingReview(null);
        setCommentInput("");
        setRatingInput("");
        toast.success("Recenzia a fost ștearsă.");
        setHasReview(false);
      } catch (error) {
        setHasReview(true);
        toast.error("A apărut o eroare la ștergerea recenziei.");
      }
    }
  };

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
    <div className="comments-container">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recenzii</h3>
      <div ref={scrollRef} className="comment-section">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-600">
            Nu există recenzii pentru acest proiect.
          </p>
        ) : (
          comments.slice(0, visibleComments).map((comment, index) => (
            <div key={index} className="comment">
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between mb-1">
                <img
                  src={comment.photoURL || "../../../assets/default-user.png"} // fallback dacă nu există imagine
                  alt={comment.name}
                  onClick={() => navigate(`/profile?id=${comment.name}`)}
                                
                  className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                />
                  
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < comment.rating ? "#facc15" : "#e5e7eb",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-1">{comment.comment}</p>
                <p className="text-xs text-gray-500 italic">
                  {formatDate(comment.timeStamp)}
                </p>
              </div>
              {currentUserRole === "teacher" &&
                comment.name === currentUserName && (
                  <div className="flex gap-3 text-primary">
                    <FaEdit
                      onClick={() => handleEdit(comment)}
                      className="cursor-pointer hover:opacity-70"
                      title="Editează"
                      size={22}
                    />
                    <FaTrash
                      onClick={handleDelete}
                      className="cursor-pointer hover:opacity-70"
                      title="Șterge"
                      size={22}
                    />
                  </div>
                )}
            </div>
          ))
        )}
        {visibleComments < comments.length && (
          <button onClick={showMoreComments} className="load-more">
            Mai multe
          </button>
        )}
      </div>

      {currentUserRole === "teacher" && (isEditing || !hasReview) && (
        <div className="comment-form mt-4">
          <label className="font-bold text-gray-800 text-xl mb-2 block">
            Recenzie proiect:
          </label>
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Scrie o recenzie detaliată despre proiectul evaluat..."
            className="comment-input resize-none h-52 text-2xl p-4 placeholder:text-xl placeholder:italic"
            rows={5}
          />

          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="text-5xl cursor-pointer transition-all"
                style={{
                  fontSize: "48px",
                  color:
                    (hoverRating || ratingInput) > i ? "#facc15" : "#e5e7eb",
                }}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRatingInput(i + 1)}
              >
                ★
              </span>
            ))}
          </div>

          <button className="comment-button" onClick={handleAddOrUpdateComment}>
            {isEditing ? "Actualizează Recenzia" : "Trimite Recenzia"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsScrollSection;
