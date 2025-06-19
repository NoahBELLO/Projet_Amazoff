# services/db_health.py
import time
from loguru import logger
# Après un échec, on « oublie » la base pendant 30 s
COOLDOWN = 30  

_mongo_ok_until   = 0
_mysql_ok_until   = 0

def test_mongo() -> bool:
    return time.time() > _mongo_ok_until

def disable_mongo():
    global _mongo_ok_until
    _mongo_ok_until = time.time() + COOLDOWN

def test_maria() -> bool:
    return time.time() > _mysql_ok_until

def disable_maria():
    global _mysql_ok_until
    _mysql_ok_until = time.time() + COOLDOWN
