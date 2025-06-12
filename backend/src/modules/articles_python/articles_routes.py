import os
from flask import Blueprint, jsonify, request, json
from loguru import logger
from articles_python.articles_model import ArticleModel
from tools.customeException import ErrorExc

bp = Blueprint("articles", __name__, url_prefix="/articles")


#https://docs.mongoengine.org/guide/querying.html
# ne – not equal to
# lt – less than
# lte – less than or equal to
# gt – greater than
# gte – greater than or equal to
# in – value is in list (a list of values should be provided)
# nin – value is not in list (a list of values should be provided)
# mod – value % x == y, where x and y are two provided values
# all – every item in list of values provided is in array
# size – the size of the array is
# exists – value for field exists

# exact – string field exactly matches value
# iexact – string field exactly matches value (case insensitive)
# contains – string field contains value
# icontains – string field contains value (case insensitive)
# startswith – string field starts with value
# istartswith – string field starts with value (case insensitive)
# endswith – string field ends with value
# iendswith – string field ends with value (case insensitive)
# wholeword – string field contains whole word
# iwholeword – string field contains whole word (case insensitive)
# regex – string field match by regex
# iregex – string field match by regex (case insensitive)
# match – performs an $elemMatch so you can match an entire document within an array


@bp.route("/", methods=["GET"])
def get_articles():
    try:
        # Récupère le chemin absolu du fichier cache
        cache_path = os.path.join(os.path.dirname(__file__), "cache", "cached_articles.json")

        with open(cache_path, "r", encoding="utf-8") as f:
            articles = json.load(f)

        return jsonify({"error": False, "rs": articles})

    except FileNotFoundError:
        return jsonify({"error": True, "rs": "Cache non trouvé, lancez le batch."})
    except Exception as e:
        return jsonify({"error": True, "rs": str(e)})

@bp.route("/all", methods=["GET"])
def get_all_articles():
    try:
        db = ArticleModel()
        error, rs = db.get_all_articles()
        return jsonify({"error": not error, "rs": rs})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    
#route get single article
@bp.route("/<article_id>", methods=["GET"])
def get_single_article(article_id):
    logger.critical("get articles")
    try:
        db = ArticleModel()
        error, rs = db.get_article(article_id)
        return jsonify({"error": not error, "rs": rs})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})

#route create
@bp.route("/create", methods=["POST"])
def create_article():
    try:
        datas = request.json #request.form avec urlencoded, sinon request.json quand il y aura le front
        db = ArticleModel()
        error, rs = db.save_data(datas)
        return jsonify({"error": not error, "rs": {"id": rs}})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})

#route patch
@bp.route("/patch/<string:id_article>", methods=["PATCH"])
def patch_article(id_article):
    try:
        datas = request.json
        db = ArticleModel()
        error, rs = db.update_data(datas, id_article)
        return jsonify({"error": not error, "rs": {"id": rs}})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    
#route delete
@bp.route("/delete/<string:id_article>", methods=["DELETE"])
def delete_article(id_article):
    try:
        db = ArticleModel()
        rs = db.delete_data(id_article)
        return jsonify({"error": not rs})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})