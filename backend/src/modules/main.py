from flask import Flask
from mongoengine import connect, disconnect_all
from loguru import logger
import sys
import os
from dotenv import load_dotenv

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
    r"/articles/*": {"origins": os.getenv("CORS_ORIGINS", "*")},
    r"/panier/*": {"origins": os.getenv("CORS_ORIGINS", "*")}
})

def init_db_connections():
    try:
        disconnect_all()

        # articles
        connect(db="Articles", host=os.getenv("MONGO_URI_ARTICLES"), alias='articles-db')
        logger.info("Connexion réussie à la base de données Articles")

        # paniers
        connect(db="Paniers", host=os.getenv("MONGO_URI_PANIERS"), alias='paniers-db')
        logger.info("Connexion réussie à la base de données Paniers")

    except Exception as e:
        logger.error(f"Erreur de connexion MongoDB : {e}")

# Initialiser les connexions à la base de données
init_db_connections()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6001, debug=True)  # debug pour reset à chaque modification de code
