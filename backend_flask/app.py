from flask import Flask
from api.chatbot import chatbot_bp
from api.email import email_bp
from api.auth_routes import otp_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # <-- ✅ Move this up here

# Register routes
app.register_blueprint(chatbot_bp)
app.register_blueprint(email_bp)
app.register_blueprint(otp_bp)

if __name__ == "__main__":
    app.run(debug=True)
