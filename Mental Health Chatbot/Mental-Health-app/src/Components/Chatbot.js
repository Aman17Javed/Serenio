import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      name: "Serenio AI",
      text: "Hello Aman! I'm Serenio AI, your personal assistant. How can I help you today?",
      time: "2:30 PM",
      sentiment: "Positive",
    },
  ]);
  const [input, setInput] = useState("");

  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      name: "Aman",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sentiment: "Neutral",
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botReply = {
        sender: "bot",
        name: "Serenio AI",
        text:
          "I understand that work stress can be overwhelming. Let me share some effective techniques:\n\n• Deep breathing exercises (4-7-8 technique)\n• Progressive muscle relaxation\n• Mindfulness meditation",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: "Positive",
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);

    setInput("");
  };

  const handleEndChat = () => {
    setMessages([
      {
        sender: "bot",
        name: "Serenio AI",
        text: "Thank you for chatting. Take care! 😊",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sentiment: "Positive",
      },
    ]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">💬 Serenio AI</div>

      <div className="chat-window" ref={chatMessagesRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-block ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
          >
            <div className="sender-name">{msg.name}</div>
            <div className="message-bubble">{msg.text}</div>
            <div className="meta">
              <span className="time">{msg.time}</span>
              <span className={`sentiment ${msg.sentiment.toLowerCase()}`}>
                {msg.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="send-button" onClick={handleSend}>
          Send
        </button>
      </div>

      <div className="end-chat-wrapper">
        <button className="end-chat-button" onClick={handleEndChat}>
          End Chat
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
