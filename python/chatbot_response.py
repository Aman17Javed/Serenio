from transformers import AutoModelForCausalLM, AutoTokenizer
import sys
import torch
import os
os.environ['HF_HOME'] = 'D:/HuggingFace'


# Model details
model_name = "tanusrich/Mental_Health_Chatbot"

# Load model & tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")

# Move model to GPU (if available)
device = "cuda" if torch.cuda.is_available() else "cpu"


# Function to generate response
def generate_response(user_input):
    inputs = tokenizer(user_input, return_tensors="pt").to(device)
    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=200,
            temperature=0.7,
            top_k=50,
            top_p=0.9,
            repetition_penalty=1.2,
            pad_token_id=tokenizer.eos_token_id
        )
    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return response

if __name__ == "__main__":
    user_input = sys.argv[1]
    print(generate_response(user_input))

