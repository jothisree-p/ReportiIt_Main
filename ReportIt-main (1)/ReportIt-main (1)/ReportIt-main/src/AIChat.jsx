import React, { useState } from "react";

import "./AIChat.css";
import { fetchAiHistory, sendAiMessage } from "./api/ai";

import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

const cleanBotText = (text) => {
  if (!text) {
    return "";
  }

  if (text.includes("ReportIt database summary")) {
    return "Hi! I checked your ReportIt records. You can ask me about complaint status, recent cases, officers, users, categories, or notifications.";
  }

  return text.replaceAll("ReportIt database", "ReportIt");
};

const AIChat = () => {
  const [open,setOpen] = useState(false);
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);
  const [historyLoaded,setHistoryLoaded] = useState(false);
  const [chat,setChat] = useState([
    {
      sender:"ai",
      text:"Hello, I am ReportIt AI Assistant. Ask me about complaints, status, users, officers, or categories.",
    },
  ]);

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (!nextOpen || historyLoaded) {
      return;
    }

    setLoading(true);
    try {
      const history = await fetchAiHistory();
      if (Array.isArray(history) && history.length > 0) {
        setChat(history.map((item) => ({
          sender:item.sender,
          text:item.sender === "ai" ? cleanBotText(item.text) : item.text,
        })));
      }
      setHistoryLoaded(true);
    } catch (err) {
      setChat((currentChat) => [
        ...currentChat,
        {
          sender:"ai",
          text:err.message || "Unable to load chat history from database.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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
          text:cleanBotText(reply),
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
        onClick={handleToggle}
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
