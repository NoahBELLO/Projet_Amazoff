from flask import Blueprint, jsonify, request
from loguru import logger
from commandes_python.commandes_en_cours_model import CommandesEnCoursModel
from commandes_python.commandes_livrees_model import CommandesLivreesModel
from tools.customeException import ErrorExc

bp = Blueprint("en_cours", __name__, url_prefix="/en_cours")

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
    logger.critical("route create commandes en cours")
    db = CommandesEnCoursModel()
    datas = request.json
    try:
        error, id = db.create(user_id, datas) 
        return jsonify({"error": not error, "id": id})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    
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
