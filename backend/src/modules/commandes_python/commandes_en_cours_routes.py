import os
from datetime import datetime, timezone
from bson import ObjectId
from flask import Blueprint, jsonify, request
from loguru import logger
from tools.db_health import disable_maria, disable_mongo, test_maria, test_mongo
from commandes_python.commandes_en_cours_model import CommandesEnCoursModel
from commandes_python.commandes_livrees_model import CommandesLivreesModel
from tools.customeException import ErrorExc

LOG_FILE = os.path.join(os.path.dirname(__file__), 'failed_insert_articles.log')
bp = Blueprint("en_cours", __name__, url_prefix="/en_cours")

def log_failure(target: str, datas: dict, error: Exception):
    timestamp = datetime.now(timezone.utc).isoformat()  
    with open(LOG_FILE, 'a', encoding='utf-8') as fichier:
        fichier.write(
            f"{timestamp} | {target} INSERT FAILED | "
            f"data={datas!r} | error={error}\n"
        )


#route get des commandes en cours
@bp.route("/<user_id>", methods=["GET"])
def get_commandes_en_cours(user_id):
    logger.critical("route get commandes en cours")
    db = CommandesEnCoursModel()
    try:
        error, rs = db.get_commande(user_id) 
        return jsonify({"error": not error, "rs": rs})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    
    
@bp.route("/create/<user_id>", methods=["POST"])
def create_commande(user_id):
    response = {"error": False, "ids": {}}
    logger.critical('route create')
    datas = request.json
    mongo_id = False
   
      # --- MongoDB ---
    if test_mongo():
        try:
            err_mongo, mongo_id = CommandesEnCoursModel().create(user_id, datas)
            if err_mongo:
                response["ids"]["mongo"] = str(mongo_id)
            else:
                raise RuntimeError("Erreur lors de la création de la commande sur MongoDB")
        except Exception as e:
            logger.warning(f"[CREATE_COMMANDE] Échec MongoDB : {e}")
            log_failure('MONGO_COMMANDE', {"user_id": user_id}, e)
            disable_mongo()

    # --- MariaDB ---
    if test_maria():
        try:
            if not mongo_id:
                mongo_id = ObjectId()
                logger.critical(f"[CREATE_CART] MongoId généré : {mongo_id}")
            
            datas_maria = datas
            datas_maria['id_mongo']
            err_maria, maria_id = CommandesEnCoursModel().create(user_id=user_id, id_mongo=str(mongo_id) , datas=datas)
            if err_maria:
                response["ids"]["mariadb"] = maria_id
            else:
                raise RuntimeError("Erreur lors de la création de la commande sur MariaDB")
        except Exception as e:
            logger.warning(f"[CREATE_COMMANDE] Échec MariaDB : {e}")
            log_failure('MARIADB_COMMANDE', {"user_id": user_id}, e)
            disable_maria()

    # Réponse 
    if not response["ids"]:
        return jsonify({"error": True, "message": "Aucun insert n’a fonctionné."})
    return jsonify({'error': False, 'rs': response})


    
@bp.route("/delete/<numero_commande>", methods=["DELETE"])
def commande_livrees(numero_commande):
    logger.critical("route commande livrées")
    db_en_cours = CommandesEnCoursModel()
    db_livrees = CommandesLivreesModel()
    try:
        error, commande, user_id = db_en_cours.delete(numero_commande) 
        if error:
            raise ErrorExc("ereur lors de la suppression")
        error, rs = db_livrees.create(commande)
        logger.critical(error, rs)
        if error is False:
            del commande['date_livraison']
            error, rs = db_en_cours.create(user_id, commande)
            if rs:
                raise ErrorExc("erreur insertion commande livrée")
        return jsonify({"error": not error, 'rs': rs})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
