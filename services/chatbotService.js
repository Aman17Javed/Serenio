const axios = require("axios");

async function generateReply(message) {
  try {
    console.log("➡️ Sending message to Flask:", message);

    const response = await axios.post(
      "http://127.0.0.1:5001/chat", // Changed from 7000 to 5001
      { message },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("⬅️ Flask replied:", response.data);
    return response.data; // Return full object { response, sentiment, confidence }
  } catch (err) {
    console.error("🔥 Chatbot error:", err.message);
    return { response: "Sorry, I couldn't respond at the moment.", sentiment: 'neutral', confidence: 0 };
  }
}

module.exports = { generateReply };