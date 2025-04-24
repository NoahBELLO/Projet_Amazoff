from flask import Blueprint, jsonify, request
from loguru import logger
from panier_python.panier_model import PanierModel
from tools.customeException import ErrorExc

bp = Blueprint("panier", __name__, url_prefix="/panier")


#création du panier
@bp.route("/create_cart/<user_id>", methods=["POST"])
def create_cart(user_id):
    try:
        logger.critical('route création panier')
        db = PanierModel()
        error, rs = db.create_cart(user_id)
        return jsonify({"error": not error, "rs": {"id": rs}})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    
#delete du panier
@bp.route("/delete_cart/<user_id>", methods=["DELETE"])
def delete_cart(user_id):
    try:
        logger.critical('route delete panier')
        db = PanierModel()
        error = db.delete_cart(user_id)
        return jsonify({"error": not error})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})