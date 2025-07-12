import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message) {
      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage("");
      // Dummy chatbot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "I'm here to help!", sender: "chatbot" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
