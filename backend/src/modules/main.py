import time, os, json
from flask import Flask
from mongoengine import connect, disconnect_all
from loguru import logger
from dotenv import load_dotenv
from tools.config import DevelopmentConfig
from tools.mysql import Mysql
from apscheduler.schedulers.background import BackgroundScheduler
from pymongo import MongoClient
import mariadb
from flask_cors import CORS

# vos modules
from articles_python.articles_routes import bp as articles_bp
from panier_python.panier_routes    import bp as panier_bp
from avis_python.avis_routes        import bp as avis_bp
from commandes_python.commandes_routes import bp as commandes_bp
from articles_python.articles_batch import run_batch_articles

load_dotenv()
app = Flask(__name__)

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
    disconnect_all()
    connect(db="Articles", 
            host=os.getenv("MONGO_URI_ARTICLES"), 
            alias='articles-db',
            serverSelectionTimeoutMS=5000,  # 5 s max pour trouver un serveur
            connectTimeoutMS=5000,          # 5 s max pour établir la connexion TCP
            socketTimeoutMS=5000     )
    connect(db="Paniers",  host=os.getenv("MONGO_URI_PANIERS"),  
            alias='paniers-db',
            serverSelectionTimeoutMS=5000,  
            connectTimeoutMS=5000,         
            socketTimeoutMS=5000  )
    connect(db="Avis",     host=os.getenv("MONGO_URI_AVIS"),     
            alias='avis-db',
            serverSelectionTimeoutMS=5000,  
            connectTimeoutMS=5000,          
            socketTimeoutMS=5000  )
    connect(db="Utilisateurs", host=os.getenv("MONGO_URI_USERS"),   
            alias='users-db',
            serverSelectionTimeoutMS=5000, 
            connectTimeoutMS=5000,          
            socketTimeoutMS=5000  )
    connect(db="Commandes",    host=os.getenv("MONGO_URI_COMMANDES"), 
            alias='commandes-db',
            serverSelectionTimeoutMS=5000,  
            connectTimeoutMS=5000,         
            socketTimeoutMS=5000  )
    app.config.from_object(DevelopmentConfig())

init_db_connections()


#vérification que Mongo est up pour lancer le batch
def wait_for_mongo_ready(uri: str, timeout: int = 3):
    logger.info("Vérification de la connexion MongoDB…")
    client = MongoClient(uri, serverSelectionTimeoutMS=2000)
    start = time.time()
    while time.time() - start < timeout:
        try:
            client.server_info()
            logger.info("MongoDB prête.")
            return True
        except:
            logger.warning("MongoDB pas encore prête")
    logger.error("MongoDB indisponible après timeout.")
    return False


#vérification que Maria est up pour lancer le batch
def wait_for_mariadb_ready(timeout: int = 3, interval: float = 1.0):
    params = {
        'host':     os.getenv('DB_LOCAL_HOST'),
        'user':     os.getenv('DB_LOCAL_LOGIN'),
        'password': os.getenv('DB_LOCAL_PASSWORD'),
        'database': os.getenv('DB_LOCAL_NAME'),
        'port':     int(os.getenv('DB_LOCAL_PORT', 33066)),
    }
    logger.debug(f"→ Connexion MariaDB avec params : {params!r}")
    logger.info("Vérification de la connexion MariaDB…")
    start = time.time()
    while time.time() - start < timeout:
        try:
            conn = mariadb.connect(**params)
            conn.close()
            logger.info("MariaDB prête.")
            return True
        except mariadb.Error as e:
            logger.warning(f"MariaDB indisponible ({e}), retry dans {interval}s…")
            time.sleep(interval)
    logger.error("MariaDB indisponible après timeout.")
    return False


if __name__ == "__main__":
    # # # # #  exécute le batch et le scheduler QUE dans le process enfant
    # if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    #     #test des BDD
    #     mongo_ok = wait_for_mongo_ready(os.getenv("MONGO_URI_ARTICLES")) \
    #             and wait_for_mongo_ready(os.getenv("MONGO_URI_AVIS"))
    #     mysql_ok = wait_for_mariadb_ready()

    #     # un app_context pour que Mysql() voie app.config
    #     with app.app_context():
    #         if mongo_ok or mysql_ok:
    #             try:
    #                 run_batch_articles()
    #                 logger.info("Batch initial exécuté.")
    #             except Exception as e:
    #                 logger.error(f"Erreur batch initial : {e}")
    #         else:
    #             logger.warning("Ni Mongo ni MariaDB ne sont prêts : batch initial sauté.")

    #     # démarrage du scheduler UNE FOIS puis toutes les 5 min
    #     scheduler = BackgroundScheduler(timezone='Europe/Paris')
    #     scheduler.add_job(run_batch_articles,
    #                       trigger='interval',
    #                       minutes=5,
    #                       id='batch_articles')
    #     scheduler.start()

    app.run(host="0.0.0.0", port=6001, debug=True)
