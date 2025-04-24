from flask import Flask
from mongoengine import connect,  disconnect_all
from loguru import logger
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from articles_python.articles_routes import bp
from panier_python.panier_routes import bp 
from flask_cors import CORS
app = Flask(__name__)

# venv/scripts/activate 
# cd src\modules => python main.py
app.register_blueprint(bp)

CORS(app, resources={r"/articles/*": {"origins": "*"}}) 

def init_db_connections():
    try:
        disconnect_all()

        # connexion à la base de données Articles
        connect(db="Articles", host="mongodb+srv://florian:florian@clusterzero.qcluw.mongodb.net/Articles?retryWrites=true&w=majority", alias='articles-db')

        # connexion à la base de données Paniers
        connect(db="Paniers", host="mongodb+srv://florian:florian@clusterzero.qcluw.mongodb.net/Paniers?retryWrites=true&w=majority", alias='paniers-db')
    except Exception as e:
        print(f"Erreur de connexion MongoDB : {e}")

init_db_connections()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6001, debug=True) #debug pour reset à chaque modification de code