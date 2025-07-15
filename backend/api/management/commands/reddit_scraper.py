from django.core.management.base import BaseCommand
from services.reddit_scraper import fetch_latest_reddit_posts
from services.firebase_client import save_reddit_post
from services.reddit_scraper import get_model
import time

class Command(BaseCommand):
    help = "Scrapes /r/technology every 60 seconds"

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting Model Training...")
        model = get_model()
        self.stdout.write("Starting Reddit scraper...")
        while True:
            try:
                posts = fetch_latest_reddit_posts()
                for post in posts:
                    post["category"] = model.predict([post["title"]])[0]
                    save_reddit_post(post)
                time.sleep(60)
            except Exception as e:
                self.stderr.write(f"Error: {e}")
                time.sleep(60)
