import os
from datetime import datetime, timezone
from bson import ObjectId
from flask import Blueprint, jsonify, request
from loguru import logger
from avis_python.avis_model import AvisModel, AvisModelMD
from articles_python.articles_model import ArticleModel
from articles_python.articles_bdd import TableArticles
from panier_python.panier_model import PanierModel, PanierModelMD
from tools.db_health import test_maria, test_mongo
from tools.customeException import ErrorExc

LOG_FILE = os.path.join(os.path.dirname(__file__), 'failed_avis_request.log')
bp = Blueprint("avis", __name__, url_prefix="/avis")


def log_failure(target: str, crud: str, datas: dict, error: Exception):
    timestamp = datetime.now(timezone.utc).isoformat()  
    with open(LOG_FILE, 'a', encoding='utf-8') as fichier:
        fichier.write(
            f"{timestamp} | {target} {crud} FAILED | "
            f"data={datas!r} | error={error}\n"
        )

#route create avis
@bp.route("/rating_article", methods=["POST"])
def rate_article():
    datas = request.json
    id_mongo = ObjectId()
    id_maria = False
    crud_operation = "INSERT"

    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_AVIS"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503

# --- MariaDB ---
    try:
        datas_sql = datas
        datas_sql['id'] = str(id_mongo)
        err_maria, id_maria = AvisModelMD().rating_article(datas_sql)
        if not err_maria:
            return jsonify({"error": True, "message": "Échec de l'insertion dans MariaDB."})

    except Exception as e:
        logger.warning(f"Échec MariaDB : {e}")
        log_failure('MARIADB_ARTICLES', crud_operation, datas, e)
        return jsonify({"error": True, "message": "Échec de l'insertion dans MariaDB."})


  # --- MongoDB ---
    try:
        db = AvisModel()
        datas_mongo = datas
        datas_mongo['id'] = str(id_mongo) 
        datas_mongo['id_maria'] = id_maria

        err_mongo, id_mongo = db.rating_article(datas)
        if not err_mongo:
            AvisModel().delete(id_maria)  
            return jsonify({"error": True, "message": "Échec de l'insertion dans MongoDB."})

    except Exception as e:
        logger.warning(f"Échec MongoDB : {e}")
        log_failure('MONGO', crud_operation, datas, e)
        AvisModel().delete(id_maria)  
        return jsonify({"error": True, "message": "Échec de l'insertion dans MongoDB."})

    return jsonify({"error": False, 'rs': {"id_mongo": id_mongo, "id_maria": id_maria}})
