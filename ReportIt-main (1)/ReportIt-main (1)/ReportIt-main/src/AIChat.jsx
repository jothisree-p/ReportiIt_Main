import React, { useState } from "react";

import "./AIChat.css";
import { sendAiMessage } from "./api/ai";

import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

const AIChat = () => {
  const [open,setOpen] = useState(false);
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);
  const [chat,setChat] = useState([
    {
      sender:"ai",
      text:"Hello, I am ReportIt AI Assistant. Ask me about complaints, status, users, officers, or categories.",
    },
  ]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if(trimmedMessage === "" || loading) {
      return;
    }

    const userMessage = {
      sender:"user",
      text:trimmedMessage,
    };

    setChat((currentChat) => [
      ...currentChat,
      userMessage,
    ]);
    setMessage("");
    setLoading(true);

    try {
      const reply = await sendAiMessage(trimmedMessage);
      setChat((currentChat) => [
        ...currentChat,
        {
          sender:"ai",
          text:reply,
        },
      ]);
    } catch (err) {
      setChat((currentChat) => [
        ...currentChat,
        {
          sender:"ai",
          text:err.message || "Unable to fetch AI reply from the database right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="ai-float-btn"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaRobot />}
      </button>

      {open && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>AI Assistant</h3>
          </div>

          <div className="chat-body">
            {chat.map((msg,index) => (
              <div
                key={index}
                className={msg.sender === "user" ? "user-msg" : "ai-msg"}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="ai-msg">
                Fetching database reply...
              </div>
            )}
          </div>

          <div className="chat-input-section">
            <input
              type="text"
              placeholder={loading ? "Fetching database reply..." : "Type message..."}
              value={message}
              disabled={loading}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
