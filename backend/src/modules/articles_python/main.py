from flask import Flask
from mongoengine import connect
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from flask_cors import CORS
from modules.articles_python.articles_routes import bp

app = Flask(__name__)
CORS(app)

# utilisation du blueprint
app.register_blueprint(bp)

# Connexion MongoDB
connect(db="ma_base_de_donnees", host="mongodb+srv://florian:florian@clusterzero.qcluw.mongodb.net/")

@app.route('/')
def home():
    return {"message": "Hello from Flask!"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6001)
