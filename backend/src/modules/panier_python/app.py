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
from src.panier_routes    import bp as panier_bp

load_dotenv()
app = Flask(__name__)

app.register_blueprint(panier_bp)

CORS(app, resources={
    r"/paniers/*": {
        "origins": os.getenv("CORS_ORIGINS", "*"),
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})


def init_db_connections():
    disconnect_all()
    connect(db="Paniers",  host=os.getenv("MONGO_URI_PANIERS"),  
            alias='paniers-db',
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
    app.run(host="0.0.0.0", port=6004, debug=True)
