import { firestore } from "../firebaseConfig";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  deleteDoc,
  orderBy,
  serverTimestamp,
  limit,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

let postsRef = collection(firestore, "posts");
let userRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");
let commentsRef = collection(firestore, "comments");
let connectionRef = collection(firestore, "connections");
let projectsRef = collection(firestore, "projects");

export const postProject = (object, callback) => {
  addDoc(projectsRef, object)
    .then(() => {
      toast.success("Project posted successfully!");
      callback();
    })
    .catch(() => {
      toast.error("Error uploading the project! Please try again.");
    });
};

export const postStatus = (object) => {
  addDoc(postsRef, object)
    .then(() => {
      toast.success("Post has been added successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getStatus = (setAllStatus) => {
  const q = query(postsRef, orderBy("timeStamp"));
  onSnapshot(q, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getUserConnections = (setUserConnections, userId) => {
  const q = query(connectionRef, where("userId", "==", userId));
  onSnapshot(q, (response) => {
    setUserConnections(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getFeedProjects = (setFeedProjects, connections) => {
  const q = query(
    projectsRef,
    orderBy("updated_at"),
    where(
      "author",
      "in",
      connections.map((connection) => connection.targetId)
    )
  );
  onSnapshot(q, (response) => {
    setFeedProjects(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getProjects = (setAllProjects, id) => {
  const q = query(
    projectsRef,
    orderBy("updated_at"),
    where("author", "==", id),
    limit(5)
  );
  onSnapshot(q, (response) => {
    setAllProjects(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getAllUsers = (setAllUsers) => {
  onSnapshot(userRef, (response) => {
    setAllUsers(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getSingleStatus = (setAllStatus, id) => {
  const singlePostQuery = query(postsRef, where("userID", "==", id), limit(10));
  onSnapshot(singlePostQuery, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getSingleUser = (setCurrentUser, email) => {
  const singleUserQuery = query(userRef, where("email", "==", email));
  onSnapshot(singleUserQuery, (response) => {
    setCurrentUser(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })[0]
    );
  });
};

export const postUserData = (object) => {
  addDoc(userRef, object)
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

export const getCurrentUser = (setCurrentUser) => {
  onSnapshot(userRef, (response) => {
    const currentUserResponse = response.docs.map((docs) => {
      return { ...docs.data(), id: docs.id };
    });

    const localStorageEmail = localStorage.getItem("userEmail");
    const foundUser = currentUserResponse.find(
      (user) => user.email.toLowerCase() === localStorageEmail.toLowerCase()
    );

    setCurrentUser(foundUser);
  });
};

export const editProfile = (userID, payload) => {
  let userToEdit = doc(userRef, userID);

  updateDoc(userToEdit, payload)
    .then(() => {
      toast.success("Profile has been updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const likePost = (userId, postId, liked) => {
  try {
    let docToLike = doc(likeRef, `${userId}_${postId}`);
    if (liked) {
      deleteDoc(docToLike);
    } else {
      setDoc(docToLike, { userId, postId });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getLikesByUser = (userId, postId, setLiked, setLikesCount) => {
  try {
    let likeQuery = query(likeRef, where("postId", "==", postId));

    onSnapshot(likeQuery, (response) => {
      let likes = response.docs.map((doc) => doc.data());
      let likesCount = likes?.length;

      const isLiked = likes.some((like) => like.userId === userId);

      setLikesCount(likesCount);
      setLiked(isLiked);
    });
  } catch (err) {
    console.log(err);
  }
};

export const postComment = (postId, comment, timeStamp, name) => {
  try {
    addDoc(commentsRef, {
      postId,
      comment,
      timeStamp,
      name,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getComments = (postId, setComments) => {
  try {
    let singlePostQuery = query(commentsRef, where("postId", "==", postId));

    onSnapshot(singlePostQuery, (response) => {
      const comments = response.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      setComments(comments);
    });
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = (id, status, postImage) => {
  let docToUpdate = doc(postsRef, id);
  try {
    updateDoc(docToUpdate, { status, postImage });
    toast.success("Post has been updated!");
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = (id) => {
  let docToDelete = doc(postsRef, id);
  try {
    deleteDoc(docToDelete);
    toast.success("Post has been Deleted!");
  } catch (err) {
    console.log(err);
  }
};

export const addConnection = (userId, targetId) => {
  try {
    let connectionToAdd = doc(connectionRef, `${userId}_${targetId}`);

    setDoc(connectionToAdd, { userId, targetId });

    toast.success("Connection Added!");
  } catch (err) {
    console.log(err);
  }
};

export const getConnections = (userId, targetId, setIsConnected) => {
  try {
    let connectionsQuery = query(
      connectionRef,
      where("targetId", "==", targetId)
    );

    onSnapshot(connectionsQuery, (response) => {
      let connections = response.docs.map((doc) => doc.data());

      const isConnected = connections.some(
        (connection) => connection.userId === userId
      );

      setIsConnected(isConnected);
    });
  } catch (err) {
    console.log(err);
  }
};

export const getProjectById = async (id) => {
  const projectDoc = doc(projectsRef, id);
  const projectSnapshot = await getDoc(projectDoc);
  if (projectSnapshot.exists()) {
    return projectSnapshot.data();
  } else {
    console.error("No such project!");
    return null;
  }
};

export const updateProjectById = async (projectId, projectData) => {
  const projectDoc = doc(projectsRef, projectId);
  await updateDoc(projectDoc, projectData);
};

// Append new function without deleting any existing ones:

/**
 * Asynchronously fetches the Firestore user document for the current user
 * from the "users" collection and returns the userId field from that document.
 *
 * This method does not use auth.currentUser.uid directly; instead, it fetches
 * the full Firestore user record and retrieves the user.userId property.
 *
 * @returns {Promise<string | null>} The Firestore userId, or null if not found.
 */
export const getFirestoreUserId = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  console.log(currentUser);
  if (!currentUser) return null;

  try {
    // Assuming the user's Firestore document is stored in the "users" collection
    // with the document ID equal to the Firebase Authentication uid.
    const userDocRef = doc(firestore, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.userId ? userData.userId : null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Firestore user:", error);
    return null;
  }
};
