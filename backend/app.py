from flask import Flask
from api.chatbot import chatbot_b

app = Flask(__name__)
app.register_blueprint(chatbot_b)

if __name__ == "__main__":
    app.run(debug=True)
