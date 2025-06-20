import os
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from loguru import logger
from panier_python.panier_model import PanierModel, PanierModelMD
from tools.customeException import ErrorExc
from bson import ObjectId
from tools.db_health import test_maria, test_mongo, disable_maria, disable_mongo

LOG_FILE = os.path.join(os.path.dirname(__file__), 'failed_cart_requests.log')
bp = Blueprint("panier", __name__, url_prefix="/panier")

def log_failure(target: str, datas: dict, error: Exception):
    timestamp = datetime.now(timezone.utc).isoformat()  
    with open(LOG_FILE, 'a', encoding='utf-8') as fichier:
        fichier.write(
            f"{timestamp} | {target} INSERT FAILED | "
            f"data={datas!r} | error={error}\n"
        )

#route get du panier
@bp.route("/<user_id>", methods=["GET"])
def get_single_article(user_id):
    logger.critical("route get panier")

    if test_mongo():
        try:                
            db = PanierModel()
            err_mongo, rs_mongo = db.get_cart(user_id) 
            if err_mongo:
                return jsonify({"error": not err_mongo, "rs": rs_mongo})
        except ErrorExc as e:
            disable_mongo()
            logger.info(f'erreur mongo {e}')
        
    if test_maria():
        try:
            db2 = PanierModelMD()
            logger.critical(user_id)
            err_maria, rs_maria = db2.get_cart(str(user_id)) 
            if err_maria:
                return jsonify({"error": not err_maria, "rs": rs_maria})
            return jsonify({"error": True, "rs": str(e)})
        except ErrorExc as e:
            disable_maria()
            logger.info(f'erreur maria {e}')
        

#création du panier
@bp.route("/create_cart/<string:user_id>", methods=["POST"])
def create_cart(user_id):
    response = {"ids": {}}
    logger.critical('route create')
    mongo_id = False
   
      # --- MongoDB ---
    if test_mongo():
        try:
            db = PanierModel()
            err_mongo, mongo_id = db.create_cart(user_id)
            if err_mongo:
                response["ids"]["mongo"] = str(mongo_id)
            else:
                raise RuntimeError("Erreur lors de la création du panier sur MongoDB")
        except ErrorExc as e:
            logger.warning(f"[CREATE_CART] Échec MongoDB : {e}")
            log_failure('MONGO_CART', {"user_id": user_id}, e)
            disable_mongo()

    # --- MariaDB ---
    if test_maria():
        try:
            if not mongo_id:
                mongo_id = ObjectId()
                logger.critical(f"[CREATE_CART] MongoId généré : {mongo_id}")
            
            datas_maria = {"total": 0, "articles": [], "user_id": user_id, "id_mongo": mongo_id}
            db2 = PanierModelMD()
            err_maria, maria_id = db2.create_cart(datas_maria)
            if err_maria:
                response["ids"]["mariadb"] = maria_id
            else:
                raise RuntimeError("Erreur lors de la création du panier sur MariaDB")
        except Exception as e:
            logger.warning(f"[CREATE_CART] Échec MariaDB : {e}")
            log_failure('MARIADB_CART', {"user_id": user_id}, e)
            disable_maria()

    # Réponse 
    if not response["ids"]:
        return jsonify({"error": True, "message": "Aucun insert n’a fonctionné."})
    return jsonify({'error': False, 'rs': response})
    

#route remove article
@bp.route("/remove_from_cart/<string:user_id>", methods=["PATCH"])
def delete_article_from_cart(user_id):
    logger.critical('route add_article')
    response = {"ids": {}}
    datas = request.json
    id_article = datas.get('article_id')

    # --- MongoDB ---
    if test_mongo():
        try:
            db = PanierModel()
            err_mongo, id_article_mongo = db.delete_article(id_article, user_id)
            if err_mongo:
                response["ids"]["mongo"] = str(id_article_mongo)
            else:
                raise RuntimeError("Erreur modification quantité panier Mongo")
        except ErrorExc as e:
            logger.warning(f"[REMOVE_FROM_CART] Échec MongoDB : {e}")
            log_failure('MONGO_CART', {"user_id": user_id}, e)
            disable_mongo()

    # --- MariaDB ---
    if test_maria():
        try:            
            db2 = PanierModelMD()
            err_maria, id_article_maria = db2.delete_article(id_article, user_id)
            if err_maria:
                response["ids"]["mariadb"] = id_article_maria
            else:
                raise RuntimeError("Erreur modification quantité panier Maria")
        except Exception as e:
            logger.warning(f"[REMOVE_FROM_CART] Échec MariaDB : {e}")
            log_failure('MARIADB_CART', {"user_id": user_id}, e)
            disable_maria()

    # Réponse 
    if not response["ids"]:
        return jsonify({"error": True, "message": "Aucun delete n’a fonctionné."})
    return jsonify({'error': False, 'rs': response})

    
#route add article
@bp.route("/add_to_cart/<string:user_id>", methods=["PATCH"])
def add_article_from_cart(user_id):
    logger.critical('route add_article')
    response = {"ids": {}}
    datas = request.json
    article_id = datas.get('article_id')
    quantite = datas.get('quantite', 1)

   
      # --- MongoDB ---
    if test_mongo():
        try:
            db = PanierModel()
            err_mongo, id_article_mongo = db.add_reduce_quantity(article_id, quantite, user_id)
            if err_mongo:
                response["ids"]["mongo"] = str(id_article_mongo)
            else:
                raise RuntimeError("Erreur modification quantité panier Mongo")
        except ErrorExc as e:
            logger.warning(f"[ADD_TO_CART] Échec MongoDB : {e}")
            log_failure('MONGO_CART', {"user_id": user_id}, e)
            disable_mongo()

    # --- MariaDB ---
    if test_maria():
        try:            
            db2 = PanierModelMD()
            err_maria, id_article_maria = db2.add_reduce_quantity(article_id, quantite, user_id)
            if err_maria:
                response["ids"]["mariadb"] = id_article_maria
            else:
                raise RuntimeError("Erreur modification quantité panier Maria")
        except Exception as e:
            logger.warning(f"[ADD_TO_CART] Échec MariaDB : {e}")
            log_failure('MARIADB_CART', {"user_id": user_id}, e)
            disable_maria()

    # Réponse 
    if not response["ids"]:
        return jsonify({"error": True, "message": "Aucun insert n’a fonctionné."})
    return jsonify({'error': False, 'rs': response})


#route modify article
@bp.route("/edit_cart/<string:user_id>", methods=["PATCH"])
def update_article_from_cart(user_id):
    logger.critical('route modify article')
    response = {"ids": {}}
    datas = request.json
    article_id = datas.get('article_id')
    quantite = datas.get('quantite', 1)

   
      # --- MongoDB ---
    if test_mongo():
        try:
            db = PanierModel()
            err_mongo, id_article_mongo = db.add_reduce_quantity(article_id, quantite, user_id, edit=True)
            if err_mongo:
                response["ids"]["mongo"] = str(id_article_mongo)
            else:
                raise RuntimeError("Erreur modification quantité panier Mongo")
        except ErrorExc as e:
            logger.warning(f"[ADD_TO_CART] Échec MongoDB : {e}")
            log_failure('MONGO_CART', {"user_id": user_id}, e)
            disable_mongo()

    # --- MariaDB ---
    if test_maria():
        try:            
            db2 = PanierModelMD()
            err_maria, id_article_maria = db2.add_reduce_quantity(article_id, quantite, user_id, edit=True)
            if err_maria:
                response["ids"]["mariadb"] = id_article_maria
            else:
                raise RuntimeError("Erreur modification quantité panier Maria")
        except Exception as e:
            logger.warning(f"[ADD_TO_CART] Échec MariaDB : {e}")
            log_failure('MARIADB_CART', {"user_id": user_id}, e)
            disable_maria()

    # Réponse 
    if not response["ids"]:
        return jsonify({"error": True, "message": "Aucun insert n’a fonctionné."})
    logger.critical(response)
    return jsonify({'error': False, 'rs': response})
    
    
#delete le panier
@bp.route("/delete_cart/<string:user_id>", methods=["DELETE"])
def delete_cart(user_id):
    logger.critical("route get panier")

    if test_mongo():
        try:                
            db = PanierModel()
            err_mongo = db.delete_cart(user_id) 
            if err_mongo:
                return jsonify({"error": not err_mongo})
        except ErrorExc as e:
            disable_mongo()
            logger.info('erreur mongo')
        
    if test_maria():
        try:
            db2 = PanierModelMD()
            err_maria = db2.delete_cart(str(user_id)) 
            if err_maria:
                return jsonify({"error": not err_maria})
            return jsonify({"error": True, "rs": str(e)})
        except ErrorExc as e:
            disable_maria()
            logger.info('erreur maria')
