import time
from flask import Flask
from mongoengine import connect, disconnect_all, get_db
from loguru import logger
import sys
import os
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from pymongo import MongoClient
from articles_python.articles_batch import run_batch_articles

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from articles_python.articles_routes import bp as articles_bp
from panier_python.panier_routes import bp as panier_bp
from avis_python.avis_routes import bp as avis_bp
from commandes_python.commandes_routes import bp as commandes_bp
from articles_python.articles_batch import run_batch_articles
from flask_cors import CORS

load_dotenv()
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

        # paniers
        connect(db="Paniers", host=os.getenv("MONGO_URI_PANIERS"), alias='paniers-db')

        # avis
        connect(db="Avis", host=os.getenv("MONGO_URI_AVIS"), alias='avis-db')
        

        # users
        connect(db="Utilisateurs", host=os.getenv("MONGO_URI_USERS"), alias='users-db')
     
        # commandes
        connect(db="Commandes", host=os.getenv("MONGO_URI_COMMANDES"), alias='commandes-db')
        
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
    
def wait_for_mongo_ready(uri: str, timeout: int = 30):
    logger.info("Vérification de la connexion MongoDB...")
    client = MongoClient(uri, serverSelectionTimeoutMS=2000)  # 2s timeout par tentative
    start_time = time.time()

    while time.time() - start_time < timeout:
        try:
            client.server_info()  # tente d'accéder aux infos du serveur
            logger.info("Connexion MongoDB établie.")
            return True
        except:
            logger.warning("MongoDB pas encore prêt, nouvelle tentative dans 1s...")
            time.sleep(1)

    logger.error("Impossible de se connecter à MongoDB après 30s.")
    return False


# Initialiser les connexions à la base de données
init_db_connections()

if __name__ == "__main__":
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        MONGO_URI_ARTICLES = os.getenv("MONGO_URI_ARTICLES")
        MONGO_URI_AVIS = os.getenv("MONGO_URI_AVIS")
        if wait_for_mongo_ready(MONGO_URI_ARTICLES) and wait_for_mongo_ready(MONGO_URI_AVIS):
            try:
                run_batch_articles()

            except Exception as e:
                logger.error(f"Erreur dans le batch initial : {e}")
        else:
            logger.warning("Batch initial non lancé car Mongo est indisponible.")

    scheduler = BackgroundScheduler()
    scheduler.add_job(run_batch_articles, 'interval', minutes=5)
    scheduler.start()

    app.run(host="0.0.0.0", port=6001, debug=True)