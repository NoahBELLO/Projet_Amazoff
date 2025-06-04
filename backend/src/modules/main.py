from flask import Flask
from mongoengine import connect, disconnect_all, get_db
from loguru import logger
import sys
import os
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from articles_python.articles_batch import run_batch_articles

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from articles_python.articles_routes import bp as articles_bp
from panier_python.panier_routes import bp as panier_bp
from avis_python.avis_routes import bp as avis_bp
from commandes_python.commandes_routes import bp as commandes_bp
# from user_python.user_routes import bp as users_bp
from flask_cors import CORS

app = Flask(__name__)

# cd .\src\modules\   
# Enregistrement des Blueprints
app.register_blueprint(articles_bp)
app.register_blueprint(panier_bp)
app.register_blueprint(avis_bp)
app.register_blueprint(commandes_bp)

CORS(app, resources={
    r"/articles/*": {
        "origins": os.getenv("CORS_ORIGINS", "*"),
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    },
    r"/panier/*": {
        "origins": os.getenv("CORS_ORIGINS", "*"),
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    },
    r"/avis/*": {
        "origins": os.getenv("CORS_ORIGINS", "*"),
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    },
    r"/commandes/*": {
        "origins": os.getenv("CORS_ORIGINS", "*"),
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
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

        # avis
        connect(db="Avis", host=os.getenv("MONGO_URI_AVIS"), alias='avis-db')
        logger.info("Connexion réussie à la base de données Avis")

        # users
        connect(db="Utilisateurs", host=os.getenv("MONGO_URI_USERS"), alias='users-db')
        logger.info("Connexion réussie à la base de données Utilisateurs")
     
        # commandes
        connect(db="Commandes", host=os.getenv("MONGO_URI_COMMANDES"), alias='commandes-db')
        logger.info("Connexion réussie à la base de données commandes")
        
    except Exception as e:
        logger.critical(f"Erreur de connexion MongoDB : {e}")
        
def check_db_connections():
    try:
        # Vérifier chaque connexion
        for alias in ['articles-db', 'paniers-db', 'avis-db', 'users-db', 'commandes-db']:
            try:
                db = get_db(alias)
                db.command('ping')
                logger.info(f"Connexion à {alias} est active")
            except Exception as e:
                logger.error(f"Problème avec {alias}: {str(e)}")
                raise ConnectionError(f"Connexion {alias} inactive")

    except Exception as e:
        logger.critical(f"Problème de connexion DB: {str(e)}")
        raise

# Initialiser les connexions à la base de données
init_db_connections()
#check_db_connections()

if __name__ == "__main__":
    scheduler = BackgroundScheduler()
    #le batch toutes les 5 minutes
    scheduler.add_job(run_batch_articles, 'interval', minutes=5)
    #démarre le scheduler
    scheduler.start()
    app.run(host="0.0.0.0", port=6001, debug=True)  # debug pour reset à chaque modification de code
