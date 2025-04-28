from flask import Flask
from mongoengine import connect, disconnect_all
from loguru import logger
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from articles_python.articles_routes import bp as articles_bp
from panier_python.panier_routes import bp as panier_bp
from flask_cors import CORS

app = Flask(__name__)

# Enregistrement des Blueprints
app.register_blueprint(articles_bp)
app.register_blueprint(panier_bp)

# Configuration CORS pour les articles et les paniers
CORS(app, resources={
    r"/articles/*": {"origins": "*"},
    r"/panier/*": {"origins": "*"}
})

def init_db_connections():
    try:
        # Déconnecter toutes les connexions existantes
        disconnect_all()

        # Connexion à la base de données Articles
        connect(db="Articles", host="mongodb+srv://florian:florian@clusterzero.qcluw.mongodb.net/Articles?retryWrites=true&w=majority", alias='articles-db')
        logger.info("Connexion réussie à la base de données Articles avec l'alias 'articles-db'")

        # Connexion à la base de données Paniers
        connect(db="Paniers", host="mongodb+srv://florian:florian@clusterzero.qcluw.mongodb.net/Paniers?retryWrites=true&w=majority", alias='paniers-db')
        logger.info("Connexion réussie à la base de données Paniers avec l'alias 'paniers-db'")

    except Exception as e:
        logger.error(f"Erreur de connexion MongoDB : {e}")

# Initialiser les connexions à la base de données
init_db_connections()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6001, debug=True)  # debug pour reset à chaque modification de code
