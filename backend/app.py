from flask import Flask
from api.chatbot import chatbot_bp
from api.email import email_bp

app = Flask(__name__)
app.register_blueprint(chatbot_bp)
app.register_blueprint(email_bp)

if __name__ == "__main__":
    app.run(debug=True)
