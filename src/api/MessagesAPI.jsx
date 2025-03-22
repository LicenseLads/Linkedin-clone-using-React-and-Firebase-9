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
  const q1 = query(
    messagesRef,
    where("senderId", "==", user1),
    where("receiverId", "==", user2),
    orderBy("timestamp", "asc")
  );

  const q2 = query(
    messagesRef,
    where("senderId", "==", user2),
    where("receiverId", "==", user1),
    orderBy("timestamp", "asc")
  );

  const unsubscribe1 = onSnapshot(q1, (snapshot1) => {
    const msgs1 = snapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const unsubscribe2 = onSnapshot(q2, (snapshot2) => {
      const msgs2 = snapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const all = [...msgs1, ...msgs2];
      const unique = Array.from(new Map(all.map(m => [m.id, m])).values());
      const sorted = unique.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);

      setMessages(sorted);
    });

    unsubscribeRef.current = () => {
      unsubscribe1();
      unsubscribe2();
    };
  });

  return () => {
    unsubscribe1();
  };
};


export const sendMessage = async (senderId, receiverId, text) => {
  await addDoc(messagesRef, {
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
  });
};
