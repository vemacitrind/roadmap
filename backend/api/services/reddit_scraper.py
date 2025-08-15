from rest_framework.decorators import api_view
from rest_framework.response import Response
import threading
import time
import requests
from bs4 import BeautifulSoup
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report

import firebase_admin # type: ignore
from firebase_admin import credentials, firestore # type: ignore

if not firebase_admin._apps:
    cred = credentials.Certificate("/home/master/Documents/ip/backend/roadmap-site-firebase.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

SCRAPER_RUNNING = False

logs_buffer = []

def save_reddit_post(post):
    doc_ref = db.collection("community").document("reddit").collection("posts").document(post["id"])
    if not doc_ref.get().exists:
        doc_ref.set({
            "uid": "0mpJx8NHbwXydCCdhBfvkqNbeyB2",  
            "title": post["title"],
            "link": post["link"],
            "category": post.get("category", "general"),
            "source": "reddit",
            "likes": 0,
            "dislikes": 0,
            "likedBy": [],
            "dislikedBy": [],
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        msg = f"[O] Added: {post['title']}"
    else:
        msg = f"[X] Already exists: {post['title']}"
    logs_buffer.append(msg)
    if len(logs_buffer) > 100:
        logs_buffer.pop(0)

def fetch_latest_reddit_posts(limit=5):
    url = "https://old.reddit.com/r/technology/new/"
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")
    posts = []
    for post in soup.select(".thing")[:limit]:
        title_tag = post.select_one("a.title")
        if title_tag:
            posts.append({
                "id": post.get("data-fullname"),
                "title": title_tag.text,
                "link": title_tag["href"]
            })
    return posts

def run_scraper():
    global SCRAPER_RUNNING
    SCRAPER_RUNNING = True
    try:
        while SCRAPER_RUNNING:
            posts = fetch_latest_reddit_posts()
            for p in posts:
                save_reddit_post(p)
            time.sleep(60)
    finally:
        SCRAPER_RUNNING = False

def train_model():
    csv_path = "data.csv"
    df = pd.read_csv(csv_path)
    top_categories = df["category"].value_counts().nlargest(5).index
    df = df[df["category"].isin(top_categories)]
    X = df["headline"]
    y = df["category"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    model = make_pipeline(TfidfVectorizer(), MultinomialNB())
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    return {
        "accuracy": accuracy,
        "precision": {k: v["precision"] for k, v in report.items() if k != "accuracy"},
        "recall": {k: v["recall"] for k, v in report.items() if k != "accuracy"},
    }

@api_view(["POST"])
def start_scraper_view(request):
    global SCRAPER_RUNNING
    if SCRAPER_RUNNING:
        return Response({"message": "Scraper already running"}, status=400)
    threading.Thread(target=run_scraper, daemon=True).start()
    return Response({"message": "Scraper started"})

@api_view(["POST"])
def stop_scraper_view(request):
    global SCRAPER_RUNNING
    if not SCRAPER_RUNNING:
        return Response({"message": "Scraper is not running"}, status=400)
    SCRAPER_RUNNING = False
    return Response({"message": "Scraper stopped"})

@api_view(["GET"])
def get_logs_view(request):
    return Response(logs_buffer[::-1])

@api_view(["POST"])
def train_model_view(request):
    metrics = train_model()
    return Response(metrics)
