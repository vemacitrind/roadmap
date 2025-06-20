import os
from dotenv import load_dotenv
import resend

load_dotenv()
resend.api_key = os.getenv("RESEND_API_KEY")

def send_progress_email(to_email, subject, html_content):
    try:
        response = resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": "randomdeveloperhelper@gmail.com",
            "subject": subject,
            "html": html_content
        })
        return response
    except Exception as e:
        print(f"Email send error: {e}")
        return None
