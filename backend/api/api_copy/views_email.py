# backend/api/views_email.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..services.smtp_client import send_progress_email

@api_view(["POST"])
def send_email(request):
    to      = request.data.get("to")
    subject = request.data.get("subject")
    html    = request.data.get("html")

    if not all([to, subject, html]):
        return Response({"error": "Missing fields"}, status=400)

    sent = send_progress_email(to, subject, html)
    return Response({"status": "sent" if sent else "failed"})

