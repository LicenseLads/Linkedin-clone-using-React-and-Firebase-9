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
  getDocs,
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

export const getCommentsForProject = (setComments, projectId) => {
  const q = query(
    commentsRef,
    orderBy("timeStamp"),
    where("projectId", "==", projectId)
  );

  onSnapshot(q, (response) => {
    setComments(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const updateComment = async (commentId, updatedData) => {
  const commentDoc = doc(commentsRef, commentId);
  await updateDoc(commentDoc, updatedData);
};

export const deleteComment = async (commentId) => {
  const commentDoc = doc(commentsRef, commentId);
  await deleteDoc(commentDoc);
};

export const getCommentsByProjectAndUser = async (projectId, authorId) => {
  const q = query(
    commentsRef,
    where("projectId", "==", projectId),
    where("authorId", "==", authorId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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

export const getConnectionCountPerUser = (setUserConnectionCount, userId) => {
  const q = query(connectionRef, where("userId", "==", userId));
  onSnapshot(q, (response) => {
    setUserConnectionCount(response.docs.length);
  });
};

export const getPostsCountPerUser = (setUserPostsCount, userId) => {
  const q = query(postsRef, where("userID", "==", userId));
  onSnapshot(q, (response) => {
    setUserPostsCount(response.docs.length);
  });
};

export const getProjectsCountPerUser = (setUserProjectsCount, userId) => {
  const q = query(projectsRef, where("author", "==", userId));
  onSnapshot(q, (response) => {
    setUserProjectsCount(response.docs.length);
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

export const getUserById = (userId, setUser) => {
  onSnapshot(doc(userRef, userId), (response) => {
    console.log(response.data());
    setUser({ ...response.data(), id: userId });
  });
};

export const editProfile = (userID, payload) => {
  let userToEdit = doc(userRef, userID);

  updateDoc(userToEdit, payload)
    .then(() => {
      toast.success("Profile has been updated successfully!");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const likePost = async (userId, postId, alreadyLiked) => {
  if (!userId || !postId) return;

  const likeDocRef = doc(likeRef, `${userId}_${postId}`);

  try {
    if (alreadyLiked) {
      await deleteDoc(likeDocRef);
    } else {
      await setDoc(likeDocRef, {
        userId,
        postId,
        timestamp: new Date(),
      });
    }
  } catch (err) {
    console.error("Eroare la like/unlike:", err);
  }
};

export const isPostLikedByUser = async (userId, postId) => {
  const likeDocRef = doc(likeRef, `${userId}_${postId}`);
  const snapshot = await getDoc(likeDocRef);
  return snapshot.exists();
};

export const getLikesCount = async (postId) => {
  const q = query(likeRef, where("postId", "==", postId));
  const snapshot = await getDocs(q);
  return snapshot.docs.length;
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

export const postComment = (document) => {
  try {
    addDoc(commentsRef, document);
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

export const getUserPhotoURL = async (userId) => {
  try {
    const userDoc = doc(firestore, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData.photoURL || "";
    } else {
      console.warn("Utilizatorul nu a fost găsit în Firestore:", userId);
      return "";
    }
  } catch (error) {
    console.error("Eroare la obținerea imaginii de profil:", error);
    return "";
  }
};

/**
 * Caută imaginea de profil a utilizatorului după `name`
 * @param {string} name - Numele utilizatorului (unic)
 * @returns {Promise<string>} - URL imagine sau fallback gol
 */
export const getUserPhotoURLByName = async (name) => {
  try {
    console.log("Caut utilizator cu numele:", name);
    const userQuery = query(
      collection(firestore, "users"),
      where("name", "==", name)
    );
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      console.log("User găsit:", userData);
      return userData.photoURL || "";
    } else {
      console.warn(`Niciun utilizator găsit cu numele: ${name}`);
      return "";
    }
  } catch (error) {
    console.error("Eroare la căutarea imaginii după nume:", error);
    return "";
  }
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
