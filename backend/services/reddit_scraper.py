import requests
from bs4 import BeautifulSoup
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report

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

def get_model():
    csv_path = "services/data.csv"
    print("[O] Loading data...")
    df = pd.read_csv(csv_path)

    print("[O] Filtering top 5 categories...")
    top_categories = df["category"].value_counts().nlargest(5).index
    df = df[df["category"].isin(top_categories)]

    X = df["headline"]
    y = df["category"]

    print("[O] Splitting into train/test sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("[O] Creating model pipeline...")
    model = make_pipeline(
        TfidfVectorizer(),
        MultinomialNB()
    )

    print("[O] Training model...")
    model.fit(X_train, y_train)
    print("[O] Training complete!")

    print("[O] Evaluating model...")
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"[O] Accuracy: {accuracy:.2f}")

    print("\n[O] Classification Report:")
    print(classification_report(y_test, y_pred))

    return model