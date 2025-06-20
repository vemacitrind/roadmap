from flask import Blueprint, request, jsonify
from services.resend_client import send_progress_email

email_bp = Blueprint("email", __name__)

@email_bp.route("/send-email", methods=["POST"])
def send_email():
    data = request.get_json()
    to = data.get("to")
    subject = data.get("subject")
    html = data.get("html")

    if not to or not subject or not html:
        return jsonify({"error": "Missing fields"}), 400

    response = send_progress_email(to, subject, html)
    return jsonify({"status": "sent" if response else "failed"})
