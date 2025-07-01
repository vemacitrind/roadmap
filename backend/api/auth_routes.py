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
    html = f"""<div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #0f0f0f; padding: 32px; color: #e4e4e7; line-height: 1.6;">
  <div style="max-width: 480px; margin: auto; background-color: #18181b; padding: 24px; border: 1px solid #27272a; border-radius: 8px;">
    
    <h2 style="text-align: center; color: #fff; font-size: 20px; margin-bottom: 16px;">Verify Your Email</h2>
    
    <p style="text-align: center; font-size: 15px; margin-bottom: 24px;">
      Thank you for signing up to <strong style="color: #3b82f6;">roadmap.in</strong>!<br />
      Use the code below to verify your email:
    </p>
    
    <div style="text-align: center; margin: 32px 0;">
      <span style="display: inline-block; background-color: #27272a; padding: 12px 24px; border-radius: 6px; font-size: 24px; letter-spacing: 4px; color: #ffffff; font-weight: bold;">
        {otp}
      </span>
    </div>

    <p style="text-align: center; font-size: 13px; color: #a1a1aa;">
      This code is valid for 10 minutes. If you didn’t request this, just ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #333; margin: 24px 0;" />

    <p style="text-align: center; font-size: 12px; color: #52525b;">
      roadmap.in · Ahmedabad, Gujarat, India
    </p>

  </div>
</div>
"""
    
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