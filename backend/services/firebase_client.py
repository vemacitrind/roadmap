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
            "uid": "system-admin",
            "name": "Roadmap-Admin",
            "photoURL": "https://private-user-images.githubusercontent.com/161121265/466580929-ffe02db1-afed-4000-bec7-fd3629895aac.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTI1OTk5ODIsIm5iZiI6MTc1MjU5OTY4MiwicGF0aCI6Ii8xNjExMjEyNjUvNDY2NTgwOTI5LWZmZTAyZGIxLWFmZWQtNDAwMC1iZWM3LWZkMzYyOTg5NWFhYy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNzE1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDcxNVQxNzE0NDJaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00ODcwMDZkYjM0MTM3NWVmZDg5ZDIwNTViODk4ZjMxOTZiZjUyM2Q3ZGY0YjE0N2Q0ZTE2Mzk2NTFhOGUwMTIzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Iu-GuGEYNMw5dNFgJs9Bgv0qd3maIxA4Qow1Np6cPVM",
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