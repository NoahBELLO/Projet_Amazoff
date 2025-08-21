# services/db_health.py

import os, time
from loguru import logger
from pymongo import MongoClient
from tools.mysql import Mysql

# Après un échec, on « oublie » la base pendant 30 s
COOLDOWN = 30  
_mongo_ok_until = 0
_mysql_ok_until = 0

def test_mongo(uri: str = None) -> bool:
    global _mongo_ok_until
    #si on est encore en cooldown, on considère Mongo down
    if time.time() < _mongo_ok_until:
        return False

    #sinon, on ping véritablement
    uri = uri or os.getenv("MONGO_URI_AVIS")
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=1000)
        client.admin.command("ping")
        return True
    except Exception as e:
        logger.warning(f"Ping MongoDB failed: {e}")
        # 3) on désactive pendant 30 s
        _mongo_ok_until = time.time() + COOLDOWN
        return False

def test_maria() -> bool:
    global _mysql_ok_until
    #cooldown
    if time.time() < _mysql_ok_until:
        return False

    # essai de connexion
    db = Mysql()
    ok = db.check_server_connexion()
    db.close_connexion()
    if ok:
        return True
    
    # désactivation temporaire
    logger.warning("Ping MariaDB failed")
    _mysql_ok_until = time.time() + COOLDOWN
    return False
