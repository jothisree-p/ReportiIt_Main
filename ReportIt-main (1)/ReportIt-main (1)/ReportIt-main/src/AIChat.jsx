import React, { useState } from "react";

import "./AIChat.css";

import {

  FaRobot,
  FaPaperPlane,
  FaTimes,

} from "react-icons/fa";

const AIChat = () => {

  const [open,setOpen] =
  useState(false);

  const [message,setMessage] =
  useState("");

  const [chat,setChat] =
  useState([

    {
      sender:"ai",
      text:"Hello 👋 I am ReportIt AI Assistant. How can I help you?",
    },

  ]);

  const handleSend = () => {

    if(message.trim() === "")
      return;

    const userMessage = {

      sender:"user",

      text:message,

    };

    let aiReply =
    "Please explain your issue clearly.";

    /* SIMPLE AI REPLIES */

    if(
      message.toLowerCase().includes("theft")
    ){

      aiReply =
      "You can report theft under Report Crime → Theft category.";

    }

    else if(
      message.toLowerCase().includes("track")
    ){

      aiReply =
      "Go to Track Status page and search using Complaint ID.";

    }

    else if(
      message.toLowerCase().includes("emergency")
    ){

      aiReply =
      "Please contact emergency services immediately or nearest police station.";

    }

    else if(
      message.toLowerCase().includes("complaint")
    ){

      aiReply =
      "You can view complaints in My Complaints section.";

    }

    const aiMessage = {

      sender:"ai",

      text:aiReply,

    };

    setChat([
      ...chat,
      userMessage,
      aiMessage,
    ]);

    setMessage("");
  };

  return (

    <>

      {/* FLOAT BUTTON */}

      <button
        className="ai-float-btn"
        onClick={() =>
          setOpen(!open)
        }
      >

        {
          open
          ? <FaTimes />
          : <FaRobot />
        }

      </button>

      {/* CHAT BOX */}

      {

        open && (

          <div className="chat-container">

            <div className="chat-header">

              <h3>
                AI Assistant
              </h3>

            </div>

            {/* CHAT BODY */}

            <div className="chat-body">

              {

                chat.map(
                  (msg,index) => (

                    <div
                      key={index}

                      className={
                        msg.sender === "user"
                        ? "user-msg"
                        : "ai-msg"
                      }
                    >

                      {msg.text}

                    </div>

                  )
                )

              }

            </div>

            {/* INPUT */}

            <div className="chat-input-section">

              <input
                type="text"
                placeholder="Type message..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
              />

              <button
                onClick={handleSend}
              >

                <FaPaperPlane />

              </button>

            </div>

          </div>

        )

      }

    </>

  );
};

export default AIChat;