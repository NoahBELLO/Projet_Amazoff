import os
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from loguru import logger
from articles_python.articles_bdd import TableArticles
from tools.db_health import test_maria, test_mongo
from panier_python.panier_bdd import TablePanier
from tools.mysql import Mysql
from panier_python.panier_model import PanierModel, PanierModelMD
from tools.customeException import ErrorExc
from bson import ObjectId

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
def get_panier(user_id):
    if test_mongo(os.getenv("MONGO_URI_PANIERS")):
        try:                
            db = PanierModel()
            err_mongo, rs_mongo = db.get_cart(user_id) 
            logger.critical(rs_mongo)
            if err_mongo:
                return jsonify({"error": not err_mongo, "rs": rs_mongo})
        except ErrorExc as e:
            logger.info(f'erreur mongo {e}')
        
    if test_maria():
        try:
            db2 = PanierModelMD()
            err_maria, rs_maria = db2.get_cart(str(user_id)) 
            if err_maria:
                return jsonify({"error": not err_maria, "rs": rs_maria})
            return jsonify({"error": True, "rs": str(e)})
        except ErrorExc as e:
            logger.info(f'erreur maria {e}')
            return jsonify({"error": not err_maria, "message": str(e)})
    logger.critical('cooldodwn de 30 s')

    return jsonify({"error": True, "message": "Aucun panier trouvé pour cet utilisateur."})
        

#création du panier
@bp.route("/create_cart/<string:user_id>", methods=["POST"])
def create_cart(user_id):
    id_mongo = ObjectId()
    maria_id = False
    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_PANIERS"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503
    
    # --- MariaDB ---
    try:            
        datas_maria = {"articles": [], "user_id": user_id, "id": str(id_mongo)}
        db2 = PanierModelMD()
        err_maria, maria_id = db2.create_cart(datas_maria)
        if not err_maria:
            return jsonify({"error": True, "message": "Échec de la création panier dans MariaDB."})
    except Exception as e:
        logger.warning(f"[CREATE_CART] Échec MariaDB : {e}")
        log_failure('MARIADB_CART', {"user_id": user_id}, e)
        return jsonify({"error": True, "message": "Rollback MariaDB, Mongo restauré."})

      # --- MongoDB ---
    try:
        db = PanierModel()
        err_mongo, id_mongo = db.create_cart(user_id, maria_id, id_mongo)
        if not err_mongo:
            db2.delete_cart(user_id)  
            return jsonify({"error": True, "message": "Échec de l'insertion dans MongoDB."})

    except ErrorExc as e:
        logger.warning(f"[CREATE_CART] Échec MongoDB : {e}")
        log_failure('MONGO_CART', {"user_id": user_id}, e)
        db2.delete_cart(user_id) 
        return jsonify({"error": True, "message": "Rollback Mongo, arrêt."})

    
    return jsonify({"error": False, 'rs': id_mongo})


#route remove article
@bp.route("/remove_from_cart/<string:user_id>", methods=["PATCH"])
def add_article_to_cart(user_id):
    datas = request.json or {}
    article_id = datas.get("article_id")

    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_PANIERS"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503

    db = PanierModel()
    db2   = PanierModelMD()


    # récup du backup
    ok_maria, old_cart = db2.get_cart_backup(user_id)
    if not ok_maria:
        return jsonify({"error": True, "message": "Panier introuvable en SQL"})


    # Maria DB
    try:
        err_maria, id_maria = db2.delete_article(article_id, user_id)
        if not err_maria:
            raise RuntimeError("Erreur MariaDB")
    except Exception as e:
        log_failure("MARIADB_CART", {"user": user_id, "article": article_id}, e)
        return jsonify({"error": True, "message": f"Échec ajout Maria {e}"}), 500

    # test MongoDB
    try:
        err_mongo, id_mongo = db.delete_article(article_id, user_id)
        if not err_mongo:
            db2.update(old_cart['id_maria'], old_cart)
            raise RuntimeError("Mongo a renvoyé False")
    except Exception as e:
        log_failure("MONGO_CART", {"user": user_id, "article": article_id}, e)
        db2.update(old_cart['id_maria'],  old_cart)
        return jsonify({"error": True, "message": "Échec ajout Mongo, Maria restauré"}), 500

    # full succès
    return jsonify({"error": False, "rs": {"mariadb": id_maria, "mongo": str(id_mongo)}}), 201

    
#route add article
@bp.route("/add_to_cart/<string:user_id>", methods=["PATCH"])
def add_article_from_cart(user_id):
    datas = request.json
    article_id = datas.get('article_id')
    quantite = datas.get('quantite', 1)

    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_PANIERS"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503

    db = PanierModel()
    db2   = PanierModelMD()

    # récup du backup
    ok_maria, old_cart = db2.get_cart_backup(user_id)
    logger.critical(f"panier backup: {old_cart}")

    if not ok_maria:
        return jsonify({"error": True, "message": "Panier introuvable en SQL"})

    # Maria DB
    try:
        err_maria, id_maria = db2.add_reduce_quantity(article_id, quantite, user_id)
        if not err_maria:
            raise RuntimeError("Erreur MariaDB")
    except Exception as e:
        log_failure('MARIADB_CART', {"user_id": user_id}, e)
        return jsonify({"error": True, "message": f"Échec ajout Maria {e}"}), 500

    # test MongoDB
    try:
        logger.debug(f"article_id:{article_id}, quantite: {quantite}, user_id: {user_id}")

        err_mongo, id_mongo = db.add_reduce_quantity(article_id, quantite, user_id)
        if not err_mongo:
            db2.update(old_cart['id_maria'], old_cart)
            raise RuntimeError("Mongo a renvoyé False")
    except Exception as e:
        log_failure("MONGO_CART", {"user": user_id, "article": article_id}, e)
        db2.update(old_cart['id_maria'],  old_cart)
        return jsonify({"error": True, "message": f"Échec ajout Mongo, Maria restauré {e}"}), 500


    else:
        return jsonify({"error": False, "rs": {"mariadb": id_maria, "mongo": str(id_mongo)}}), 201


#route modify article
@bp.route("/edit_cart/<string:user_id>", methods=["PATCH"])
def update_article_from_cart(user_id):
    logger.critical('route modify article')
    response = {"ids": {}}
    datas = request.json
    article_id = datas.get('article_id')
    quantite = datas.get('quantite', 1)

    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_PANIERS"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503

    db = PanierModel()
    db2   = PanierModelMD()

    # récup du backup
    ok_maria, old_cart = db2.get_cart_backup(user_id)

    if not ok_maria:
        return jsonify({"error": True, "message": "Panier introuvable en SQL"})

    # Maria DB
    try:
        err_maria, id_maria = db2.add_reduce_quantity(article_id, quantite, user_id, edit=True)
        if not err_maria:
            raise RuntimeError("Erreur MariaDB")
    except Exception as e:
        log_failure('MARIADB_CART', {"user_id": user_id}, e)
        return jsonify({"error": True, "message": f"Échec ajout Maria {e}"}), 500

    # test MongoDB
    try:
        err_mongo, id_mongo = db.add_reduce_quantity(article_id, quantite, user_id, edit=True)
        if not err_mongo:
            db2.update(old_cart['id_maria'], old_cart)
            return jsonify({"error": not err_mongo})
    except Exception as e:
            log_failure("MONGO_CART", {"user": user_id, "article": article_id}, e)
            db2.update(old_cart['id_maria'],  old_cart)
            return jsonify({"error": True, "message": f"Échec ajout Mongo, Maria restauré {e}"}), 500


    else:
        return jsonify({"error": False, "rs": {"mariadb": id_maria, "mongo": str(id_mongo)}}), 201
    
    
#delete le panier
@bp.route("/delete_cart/<string:user_id>", methods=["DELETE"])
def delete_cart(user_id):
    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_PANIERS"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503
    db = PanierModel()
    db2 = PanierModelMD()

    # récup du backup
    ok_maria, old_cart = db2.get_cart_backup(user_id)
    logger.critical(f"panier backup: {old_cart}")

    if not ok_maria:
        return jsonify({"error": True, "message": "Panier introuvable en SQL"})
    
    #MariaDB
    try:
        err_maria = db2.delete_cart(str(user_id)) 
        if not err_maria:
            return jsonify({"error": not err_maria})
    except ErrorExc as e:
        return jsonify({"error": True, "message": f"Échec suppression Maria {e}"}), 500


    #MongoDB
    try:                
        err_mongo = db.delete_cart(user_id) 
        if not err_mongo:
            db2.update(old_cart['id_maria'], old_cart)
            return jsonify({"error": not err_mongo})
        
    except ErrorExc as e:
        db2.recreate_cart(old_cart['id_maria'],  old_cart)
        log_failure("MONGO_CART", {"user": user_id}, e)
        return jsonify({"error": True, "message": f"Échec suppression Mongo, Maria restauré {e}"}), 500


    else:
        return jsonify({"error": False, "message": "Panier supprimé avec succès"})
    