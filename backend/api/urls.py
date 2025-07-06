from django.urls import path
from api.api_copy import views_auth, views_chatbot, views_email,views_startroadmap_email

urlpatterns = [
    path("auth/request-otp",views_auth.request_otp,name="request_otp"),
    path("auth/verify-otp",views_auth.verify_otp,name="verify_otp"),
    path("chatbot",views_chatbot.chatbot),
    path("send-email",views_email.send_email),
    path("send-roadmap-start-email",views_startroadmap_email.startroadmap_email)
]
