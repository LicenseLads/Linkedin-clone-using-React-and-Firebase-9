import React, { useEffect, useState, useRef } from "react";
import { getAllUsers } from "../api/FirestoreAPI";
import { getMessages, sendMessage } from "../api/MessagesAPI";
import "../Sass/MessagesComponent.scss";

export default function MessagesComponent({ currentUser }) {
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    getAllUsers((users) => {
      const filtered = users.filter((u) => u.id !== currentUser.id);
      setConnections(filtered);
    });
  }, [currentUser]);
  useEffect(() => {
    if (location?.state?.selectedUserId && connections.length > 0) {
      const found = connections.find(u => u.id === location.state.selectedUserId);
      if (found) {
        setSelectedUser(found);
      }
    }
  }, [connections, location?.state?.selectedUserId]);
  
  useEffect(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    if (selectedUser) {
      setMessages([]);
      unsubscribeRef.current = getMessages(currentUser.id, selectedUser.id, (msgs) => {
        setMessages(msgs);
        scrollToBottom();
      });
    }
  }, [selectedUser]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const selectConversation = (user) => {
    setSelectedUser(user);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    await sendMessage(currentUser.id, selectedUser.id, newMessage);
    setNewMessage("");
    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "";
    const date = new Date(timestamp.toDate());
    return date.toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "";
    const date = new Date(timestamp.toDate());
    return date.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateHeader = (dateKey) => {
    const today = new Date();
    const dateParts = dateKey.split(".");
    const formattedDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

    const isToday =
      formattedDate.getDate() === today.getDate() &&
      formattedDate.getMonth() === today.getMonth() &&
      formattedDate.getFullYear() === today.getFullYear();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      formattedDate.getDate() === yesterday.getDate() &&
      formattedDate.getMonth() === yesterday.getMonth() &&
      formattedDate.getFullYear() === yesterday.getFullYear();

    if (isToday) return "Azi";
    if (isYesterday) return "Ieri";

    return dateKey;
  };

  const groupMessagesByDate = (msgs) => {
    const messagesByDate = {};
    msgs.forEach((msg) => {
      if (!msg.timestamp || !msg.timestamp.toDate) return;
      const d = new Date(msg.timestamp.toDate());
      const dateKey = d.toLocaleDateString("ro-RO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!messagesByDate[dateKey]) {
        messagesByDate[dateKey] = [];
      }
      messagesByDate[dateKey].push(msg);
    });

    return Object.keys(messagesByDate).map((dateKey) => ({
      dateKey,
      dailyMessages: messagesByDate[dateKey],
    }));
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="messages-page">
      <div className="connections-list">
        <h2>Conexiuni</h2>
        {connections.map((connection) => (
          <div
            key={connection.id}
            className={`connection-item ${
              selectedUser?.id === connection.id ? "active" : ""
            }`}
            onClick={() => selectConversation(connection)}
          >
            <img
              src={connection.imageLink || "https://storage.googleapis.com/meraki-photos/profile/default-user.webp"}
              alt="profile"
              className="connection-avatar"
            />
            <div className="connection-info">
              <p className="connection-name">{connection.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-panel">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <img
                src={selectedUser.imageLink || "https://storage.googleapis.com/meraki-photos/profile/default-user.webp"}
                alt="Selected Profile"
                className="chat-header-avatar"
              />
              <h3 className="chat-header-name">{selectedUser.name}</h3>
            </div>

            <div className="messages-list">
              {groupedMessages.map(({ dateKey, dailyMessages }) => (
                <div key={dateKey}>
                  <div className="date-divider">
                    {formatDateHeader(dateKey)}
                  </div>

                  {dailyMessages.map((msg) => {
                    const isSentByCurrentUser = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`message-row ${
                          isSentByCurrentUser ? "sent" : "received"
                        }`}
                      >
                        {!isSentByCurrentUser && (
                          <img
                            src={
                              selectedUser.imageLink ||
                              "https://storage.googleapis.com/meraki-photos/profile/default-user.webp"
                            }
                            alt="Avatar"
                            className="message-avatar"
                          />
                        )}
                        <div className="message-bubble">
                          <p className="message-text">{msg.text}</p>
                          <span className="message-timestamp">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-bar">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Scrie un mesaj ..."
                onKeyDown={handleKeyPress}
              />
              <button onClick={handleSend} disabled={!newMessage.trim()}>
                Trimite
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h2>Selectează o conversație</h2>
            <p>Apasă pe unul dintre utilizatori în lista din stânga.</p>
          </div>
        )}
      </div>
    </div>
  );
}
