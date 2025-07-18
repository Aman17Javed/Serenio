const axios = require("axios");

async function generateReply(message) {
  try {
    console.log("➡️ Sending message to Flask:", message);

    const response = await axios.post(
                "http://127.0.0.1:7000/chat",
                { message },
                { headers: { "Content-Type": "application/json" } }
);


    console.log("⬅️ Flask replied:", response.data);
    return response.data.response;
  } catch (err) {
    console.error("🔥 Chatbot error:", err.message);
    return "Sorry, I couldn't respond at the moment.";
  }
}

module.exports = { generateReply };  // ✅ this was missing!