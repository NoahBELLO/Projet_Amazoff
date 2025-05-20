from flask import Blueprint, jsonify, request
from loguru import logger
from panier_python.panier_model import PanierModel
from tools.customeException import ErrorExc

bp = Blueprint("panier", __name__, url_prefix="/panier")

#route get du panier
@bp.route("/<user_id>", methods=["GET"])
def get_single_article(user_id):
    db = PanierModel()
    logger.critical("route get panier")
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
    
#route remove article
@bp.route("/remove/<string:id_user>", methods=["PATCH"])
def delete_article_from_cart(id_user):
    logger.critical(request.json)
    try:
        id_article = request.json 
        db = PanierModel()
        error = db.delete_article(id_article, id_user)
        return jsonify({"error": not error})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    
#route add article
@bp.route("/add/<string:id_user>", methods=["PATCH"])
def add_article_from_cart(id_user):
    logger.critical(request.json)
    try:
        datas = request.json 
        article_id = datas.get('article_id')
        quantite = datas.get('quantite', 1)
        db = PanierModel()
        error = db.add_article(article_id, quantite, id_user)
        return jsonify({"error": not error})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})

#route modify article
@bp.route("/edit/<string:id_user>", methods=["PATCH"])
def update_article_from_cart(id_user):
    logger.critical(request.json)
    try:
        datas = request.json 
        db = PanierModel()
        error, rs = db.modify_article(datas, id_user)
        return jsonify({"error": not error, "rs": {"id": rs}})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    

#delete le panier
@bp.route("/delete_cart/<string:user_id>", methods=["DELETE"])
def delete_cart(user_id):
    try:
        logger.critical('route delete panier')
        db = PanierModel()
        error = db.delete_cart(user_id)
        return jsonify({"error": not error})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})