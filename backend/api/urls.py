from django.urls import path
from api.api_copy import views_auth, views_chatbot, views_email,views_startroadmap_email,views_generate_img_url

urlpatterns = [
    path("auth/request-otp",views_auth.request_otp,name="request_otp"),
    path("auth/verify-otp",views_auth.verify_otp,name="verify_otp"),
    path("chatbot",views_chatbot.chatbot),
    path("send-email",views_email.send_email),
    path("send-roadmap-start-email",views_startroadmap_email.startroadmap_email),
    path("send-purchase-email",views_startroadmap_email.payment_emails),
    path("api/generate-img-url", views_generate_img_url.generate_img_url),
    path("api/generate-project-img-url", views_generate_img_url.generate_project_img_urls),

]
