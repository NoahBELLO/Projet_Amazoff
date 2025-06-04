from flask import Blueprint, jsonify, request
from loguru import logger
from commandes_python.commandes_livrees_model import CommandesLivreesModel
from tools.customeException import ErrorExc

bp = Blueprint("livrees", __name__, url_prefix="/livrees")

#route get des commandes
@bp.route("/<user_id>", methods=["GET"])
def get_commandes_livrees(user_id):
    logger.critical("route get commandes livrées")
    return("routes checked")
    # # try:
    # #     error, rs = db.get_commandes(user_id) 
    #     return jsonify({"error": not error, "rs": rs})
    # except ErrorExc as e:
    #     return jsonify({"error": True, "rs": str(e)})
