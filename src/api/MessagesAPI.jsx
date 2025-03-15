import { firestore } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const messagesRef = collection(firestore, "messages");

export const getMessages = (user1, user2, setMessages) => {
  const q = query(
    messagesRef,
    where("senderId", "in", [user1, user2]),
    where("receiverId", "in", [user1, user2]),
    orderBy("timestamp", "asc") // necesită index!
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMessages(msgs);
  });
};

export const sendMessage = async (senderId, receiverId, text) => {
  await addDoc(messagesRef, {
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
  });
};
