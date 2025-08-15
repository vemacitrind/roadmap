# backend/api/views_chatbot.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..services.openai_client import generate_custom_roadmap

@api_view(["POST"])
def chatbot(request):
    prompt = request.data.get("prompt")
    if not prompt:
        return Response({"error": "Prompt is required"}, status=400)

    try:
        roadmap = generate_custom_roadmap(prompt)
        return Response({"roadmap": roadmap})
    except Exception as e:
        print("Chatbot error:", e)
        return Response({"error": str(e)}, status=500)
