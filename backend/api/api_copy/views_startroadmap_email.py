from rest_framework.decorators import api_view
from rest_framework.response import Response
from services.smtp_client import send_progress_email

@api_view(["POST"])
def startroadmap_email(request):
    email = request.data.get("email")
    title = request.data.get("title")
    des = request.data.get("description")

    if not email or not des or not title:
        return Response({"error":"Something went wronge!"},status=400)
    
    html = f"""
<div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #0f0f0f; padding: 32px; color: #e4e4e7; line-height: 1.6;">
    <div style="max-width: 480px; margin: auto; background-color: #18181b; padding: 24px; border: 1px solid #27272a; border-radius: 8px;">

        <div style="justify-content: center;align-items:center;display:flex;gap:15px;"><img src="https://github.com/user-attachments/assets/cef38843-b715-4186-ac10-d27ff3f62c3d" width="34">
            <h1 style="font-family: serif;">roadmap.in</h1>
        </div>
        <hr style="border:none;border-top:1px solid #333;margin:24px 0" />

        <h2 style="text-align: center; color: #fff; font-size: 20px; margin-bottom: 16px;">
            🎉 You’ve Started a New Roadmap!
        </h2>

        <p style="text-align: center; font-size: 15px; margin-bottom: 24px;">
            Thanks for choosing <strong style="color: #3b82f6;">roadmap.in</strong> to guide your learning journey.
        </p>

        <div style="margin-bottom: 24px;">
            <p style="font-size: 16px; font-weight: bold; color: #fff; text-align: center;">{title}</p>
            <p style="text-align: center; color: #a1a1aa; font-size: 14px;">{des}</p>
        </div>

        <p style="text-align: center; font-size: 13px; color: #a1a1aa;">
            Track your progress daily and come back anytime to pick up where you left off.
        </p>

        <div style="text-align: center; margin-top: 32px;">
            <a href="https://roadmap.in/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Go to Dashboard
            </a>
        </div>

        <hr style="border: none; border-top: 1px solid #333; margin: 32px 0;" />

        <p style="text-align: center; font-size: 12px; color: #52525b;">
            roadmap.in · Ahmedabad, Gujarat, India
        </p>
    </div>
</div>
"""

    success = send_progress_email(email, f"You've started {title}", html)
    return Response({"status": "sent" if success else "failed"})