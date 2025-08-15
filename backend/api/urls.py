from django.urls import path
from api.api_copy import views_auth, views_chatbot, views_email,views_startroadmap_email,views_generate_img_url
from api.services import reddit_scraper
from api.docker import code_runner
urlpatterns = [
    #api copy
    path("auth/request-otp",views_auth.request_otp,name="request_otp"),
    path("auth/verify-otp",views_auth.verify_otp,name="verify_otp"),
    path("chatbot",views_chatbot.chatbot),
    path("send-email",views_email.send_email),
    path("send-roadmap-start-email",views_startroadmap_email.startroadmap_email),
    path("send-purchase-email",views_startroadmap_email.payment_emails),
    path("api/generate-img-url", views_generate_img_url.generate_img_url),
    path("api/generate-project-img-url", views_generate_img_url.generate_project_img_urls),

    #service
    path("scraper/start/", reddit_scraper.start_scraper_view),
    path("scraper/stop/", reddit_scraper.stop_scraper_view),
    path("scraper/logs/", reddit_scraper.get_logs_view),
    path("scraper/train/", reddit_scraper.train_model_view),

    #compiler
    path("api/run-code/", code_runner.run_code),
]
