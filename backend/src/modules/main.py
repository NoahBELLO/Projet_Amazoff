from flask import Flask
from mongoengine import connect
from loguru import logger
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from articles_python.articles_routes import bp
from flask_cors import CORS
app = Flask(__name__)

# venv/scripts/activate 
# cd src\modules => python main.py
app.register_blueprint(bp)
#Pour accepter les requêtes de pré-vol sinon pas de connexion entre front et back
CORS(app, resources={r"/articles/*": {"origins": "*"}}) 

# Connexion MongoDB
try:
    connect(db="Articles", host="mongodb+srv://florian:florian@clusterzero.qcluw.mongodb.net/Articles?retryWrites=true&w=majority")
except Exception as e:
    print(f"Erreur de connexion MongoDB : {e}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6001, debug=True) #debug pour reset à chaque modification de code