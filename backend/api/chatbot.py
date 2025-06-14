from flask import Blueprint, request, jsonify
from services.openai_client import generate_custom_roadmap 

chatbot_b = Blueprint("chatbot", __name__)

@chatbot_b.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    print("Received data:", data)

    user_prompt = data.get("prompt")
    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        roadmap = generate_custom_roadmap(user_prompt)
        print("Generated roadmap:", roadmap)
        return jsonify({"roadmap": roadmap}), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500