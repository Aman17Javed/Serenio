print("🧠 Flask startup confirmed")
from flask import Flask, request, jsonify
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
import torch
from dotenv import load_dotenv
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 👈 Enable CORS globally

load_dotenv()

port = int(os.environ.get("PORT", 7000))

app = Flask(__name__)

model_name = "facebook/blenderbot-400M-distill"
tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "ok", "message": "Flask chatbot is running."}), 200


@app.route("/chat", methods=["POST"])
def chat():
    print("✅ /chat route hit")
    try:
        data = request.get_json(force=True)
        user_input = data.get("message", "")
        if not user_input:
            return jsonify({"error": "No message provided"}), 400

        inputs = tokenizer(user_input, return_tensors="pt").to(device)
        output = model.generate(
            **inputs,
            max_new_tokens=100,
            temperature=0.7,
            top_k=50,
            top_p=0.9,
            repetition_penalty=1.2
        )
        response = tokenizer.decode(output[0], skip_special_tokens=True)
        return jsonify({"response": response})

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)