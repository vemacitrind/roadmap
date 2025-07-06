from rest_framework.decorators import api_view
from rest_framework.response import Response
from services.smtp_client import send_progress_email
import random, time

# {email: {"otp": "123456", "ts": 1690000000}}
otp_storage = {}

OTP_EXPIRY = 600  # 10 minutes (seconds)


@api_view(["POST"])
def request_otp(request):
    to = request.data.get("to")
    if not to:
        return Response({"error": "Missing email"}, status=400)
    otp = str(random.randint(100000, 999999))
    otp_storage[to] = {"otp": otp, "ts": time.time()}
    print("Generated OTP:", otp)

    subject = "Your OTP Code"
    html = f"""<div style="font-family: 'Segoe UI', Roboto, sans-serif; background:#0f0f0f;padding:32px;color:#e4e4e7;line-height:1.6">
     
      <div style="max-width:480px;margin:auto;background:#18181b;padding:24px;border:1px solid #27272a;border-radius:8px">
        <div style="justify-content: center;align-items:center;display:flex;gap:15px;"><img src="https://github.com/user-attachments/assets/cef38843-b715-4186-ac10-d27ff3f62c3d"  width="34">
        <h1 style="font-family: serif;">roadmap.in</h1>
        </div>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0" />
        <h2 style="text-align:center;color:#fff;font-size:20px;margin-bottom:16px">Verify Your Email</h2>
        <p style="text-align:center;font-size:15px;margin-bottom:24px">
          Thank you for signing up to <strong style="color:#3b82f6">roadmap.in</strong>!<br />
          Use the code below to verify your email:
        </p>
        <div style="text-align:center;margin:32px 0">
          <span style="display:inline-block;background:#27272a;padding:12px 24px;border-radius:6px;font-size:24px;letter-spacing:4px;color:#fff;font-weight:bold">
            {otp}
          </span>
        </div>
        <p style="text-align:center;font-size:13px;color:#a1a1aa">
          This code is valid for 10&nbsp;minutes. If you didn’t request this, just ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0" />
        <p style="text-align:center;font-size:12px;color:#52525b">
          roadmap.in&nbsp;· Ahmedabad, Gujarat, India
        </p>
      </div>
 </div>"""

    sent = send_progress_email(to, subject, html)
    return Response({"status": "sent" if sent else "failed"})


@api_view(["POST"])
def verify_otp(request):
    email = request.data.get("email")
    otp_input = request.data.get("otp")

    if not email or not otp_input:
        return Response({"error": "Missing email or OTP"}, status=400)

    record = otp_storage.get(email)
    if record and otp_input == record["otp"] and time.time() - record["ts"] < OTP_EXPIRY:
        return Response({"verified": True})

    return Response({"verified": False}, status=401)
