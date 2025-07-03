from rest_framework.decorators import api_view
from rest_framework.response import Response

from backend.api.api_copy.views_chatbot import chatbot_bp as chatbot_logic  
from backend.api.api_copy.views_email   import send_email                   
from backend.api.api_copy.views_auth import request_otp, verify_otp

@api_view(["POST"])
def chatbot_view(request):
    reply = chatbot_logic(request.data.get("message", ""))
    return Response({"answer": reply})

@api_view(["POST"])
def email_view(request):
    data = request.data
    send_email(data["to"], data["subject"], data["body"])
    return Response({"status": "sent"})

@api_view(["POST"])
def otp_view(request):
    mode = request.data.get("mode")
    if mode == "send":
        request_otp(request.data["email"])
        return Response({"status": "otp-sent"})
    if mode == "verify":
        ok = verify_otp(request.data["email"], request.data["otp"])
        return Response({"verified": ok})
    return Response({"error": "invalid mode"}, status=400)
