from flask import Blueprint, jsonify, request
from loguru import logger
from panier_python.panier_model import PanierModel
from tools.customeException import ErrorExc

bp = Blueprint("panier", __name__, url_prefix="/panier")

#route get single article
@bp.route("/<user_id>", methods=["GET"])
def get_single_article(user_id):
    db = PanierModel()
    try:
        error, rs = db.get_cart(user_id) #.first pour récup le premier de la liste
        return jsonify({"error": not error, "panier": rs})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})

#création du panier
@bp.route("/create_cart/<string:user_id>", methods=["POST"])
def create_cart(user_id):
    try:
        logger.critical('route création panier')
        db = PanierModel()
        error, rs = db.create_cart(user_id)
        return jsonify({"error": not error, "rs": {"id": rs}})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    

#route patch
@bp.route("/patch/<string:id_user>", methods=["PATCH"])
def update_cart(id_user):
    logger.critical('route update panier')
    logger.critical(request.json)
    try:
        datas = request.json 
        db = PanierModel()
        error, rs = db.update_cart(datas, id_user)
        return jsonify({"error": not error, "rs": {"id": rs}})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    

#delete du panier
@bp.route("/delete_cart/<string:user_id>", methods=["DELETE"])
def delete_cart(user_id):
    try:
        logger.critical('route delete panier')
        db = PanierModel()
        error = db.delete_cart(user_id)
        return jsonify({"error": not error})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})