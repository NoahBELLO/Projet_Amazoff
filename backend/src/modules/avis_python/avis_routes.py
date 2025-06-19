import os
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from loguru import logger
from avis_python.avis_model import AvisModel
from articles_python.articles_model import ArticleModel
from tools.customeException import ErrorExc

LOG_FILE = os.path.join(os.path.dirname(__file__), 'failed_insert_articles.log')
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
    try:
        datas = request.json
        db = AvisModel()
        
        error = db.rating_article(datas)
        return jsonify({"error": not error})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})

