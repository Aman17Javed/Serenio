from flask import Flask, request, jsonify
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration, pipeline
import torch

app = Flask(__name__)

# Load Blenderbot model and tokenizer
model_name = "facebook/blenderbot-400M-distill"
tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Load sentiment analysis model
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"})
@app.route("/chat", methods=["POST"])
def chat():
    print("✅ /chat route hit")
    try:
        # Force JSON parsing with error handling
        data = request.get_json(force=True, silent=False)
        user_input = data.get("message", "").strip()
        if not user_input:
            print("❌ Error: No message provided")
            return jsonify({"error": "No message provided"}), 400
        # Generate chatbot response
        inputs = tokenizer(user_input, return_tensors="pt").to(device)
        output = model.generate(
            **inputs,
            max_new_tokens=100,
            do_sample=True,  # Use valid parameter
            num_beams=5      # Use beam search for better responses
        )
        response = tokenizer.decode(output[0], skip_special_tokens=True)
        # Perform sentiment analysis
        sentiment_result = sentiment_analyzer(user_input)[0]
        sentiment = sentiment_result['label']
        confidence = sentiment_result['score']
        print(f"✅ Processed input: {user_input}, Sentiment: {sentiment}, Confidence: {confidence}")
        return jsonify({"response": response, "sentiment": sentiment, "confidence": confidence})
    except ValueError as ve:
        print(f"❌ JSON Error: {str(ve)}")
        return jsonify({"error": "Invalid JSON format"}), 400
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)