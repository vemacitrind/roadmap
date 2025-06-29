from flask import Blueprint, request, jsonify
from services.smtp_client import send_progress_email
import random

otp_bp = Blueprint("otp", __name__)
otp_storage = {}  

@otp_bp.route("/auth/request-otp", methods=["POST"])
def request_otp():
    data = request.get_json()
    to = data.get("to")
    if not to:
        return jsonify({"error": "Missing email"}), 400

    # Generate OTP
    otp = str(random.randint(100000, 999999))
    otp_storage[to] = otp

    subject = "Your OTP Code"
    html = f"<p>Your OTP is: <strong>{otp}</strong></p>"

    success = send_progress_email(to, subject, html)
    return jsonify({"status": "sent" if success else "failed"})

@otp_bp.route("/auth/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()
    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return jsonify({"error": "Missing email or OTP"}), 400

    expected_otp = otp_storage.get(email)

    if expected_otp and otp == expected_otp:
        return jsonify({"verified": True})

    return jsonify({"verified": False}), 401