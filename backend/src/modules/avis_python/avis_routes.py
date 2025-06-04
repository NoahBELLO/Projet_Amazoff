from flask import Blueprint, jsonify, request
from loguru import logger
from avis_python.avis_model import AvisModel
from articles_python.articles_model import ArticleModel
from tools.customeException import ErrorExc

bp = Blueprint("avis", __name__, url_prefix="/avis")

#route patch
@bp.route("/rating_article", methods=["PATCH"])
def rate_article():
    try:
        datas = request.json
        db = AvisModel()
        
        error = db.rating_article(datas)
        return jsonify({"error": not error})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})

