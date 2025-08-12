import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate("/home/master/Documents/ip/backend/roadmap-site-firebase.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

def save_reddit_post(post):
    doc_ref = db.collection("community").document("reddit").collection("posts").document(post["id"])

    if not doc_ref.get().exists:
        doc_ref.set({
            "uid": "0mpJx8NHbwXydCCdhBfvkqNbeyB2",  # Admin UID only
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
        print(f"[O] Added: {post['title']}")
    else:
        print(f"[X] Already exists: {post['title']}")
