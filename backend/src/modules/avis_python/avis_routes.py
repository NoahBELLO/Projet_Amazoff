import os
from datetime import datetime, timezone
from bson import ObjectId
from flask import Blueprint, jsonify, request
from loguru import logger
from avis_python.avis_model import AvisModel
from articles_python.articles_model import ArticleModel
from articles_python.articles_bdd import TableArticles
from panier_python.panier_model import PanierModel, PanierModelMD
from tools.db_health import test_maria, test_mongo
from tools.customeException import ErrorExc

LOG_FILE = os.path.join(os.path.dirname(__file__), 'failed_avis_request.log')
bp = Blueprint("avis", __name__, url_prefix="/avis")


def log_failure(target: str, datas: dict, error: Exception):
    timestamp = datetime.now(timezone.utc).isoformat()  
    with open(LOG_FILE, 'a', encoding='utf-8') as fichier:
        fichier.write(
            f"{timestamp} | {target} INSERT FAILED | "
            f"data={datas!r} | error={error}\n"
        )


#route patch
@bp.route("/rating_article", methods=["PATCH"])
def rate_article():
    response = {"ids": {}}
    logger.critical('route create avis')
    datas = request.json
    mongo_id = False
    id_maria = TableArticles().getLastId()
    logger.critical(datas)

  # --- MongoDB ---
    if test_mongo(os.getenv("MONGO_URI_AVIS")):
        try:
            db = AvisModel()
            err_mongo, mongo_id = db.rating_article(datas, id_maria + 1)
            if err_mongo:
                response["ids"]["mongo"] = str(mongo_id)
            else:
                raise RuntimeError("Erreur lors de la création du panier sur MongoDB")
        except ErrorExc as e:
            logger.warning(f"[CREATE_CART] Échec MongoDB : {e}")
            log_failure('MONGO_CART', {"user_id": datas['user_id']}, e)

#  # --- MariaDB ---
#     if test_maria():
#         try:
#             if not mongo_id:
#                 mongo_id = ObjectId()
#                 logger.critical(f"[CREATE_CART] MongoId généré : {mongo_id}")
            
#             datas_maria = {"articles": [], "user_id": user_id, "id": mongo_id}
#             db2 = PanierModelMD()
#             err_maria, maria_id = db2.rating_article(datas_maria)
#             if err_maria:
#                 response["ids"]["mariadb"] = maria_id
#             else:
#                 raise RuntimeError("Erreur lors de la création du panier sur MariaDB")
#         except Exception as e:
#             logger.warning(f"[CREATE_CART] Échec MariaDB : {e}")
#             log_failure('MARIADB_CART', {"user_id": user_id}, e)
#             disable_maria()

    # Réponse 
    if not response["ids"]:
        return jsonify({"error": True, "message": "Aucun insert n’a fonctionné."})
    return jsonify({'error': False, 'rs': response})
    
    
    try:
        datas = request.json
        db = AvisModel()
        
        error = db.rating_article(datas)
        return jsonify({"error": not error})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})

