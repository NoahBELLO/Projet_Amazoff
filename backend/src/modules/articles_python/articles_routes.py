from datetime import datetime, timezone
import os
from flask import Blueprint, jsonify, request, json
from loguru import logger
from articles_python.articles_model import ArticleModel
from articles_python.articles_model import ArticleModelMD
from articles_python.articles_bdd import TableArticles
from tools.customeException import ErrorExc
from tools.db_health import test_mongo, test_maria, disable_mongo, disable_maria
from bson import ObjectId


LOG_FILE = os.path.join(os.path.dirname(__file__), 'failed_articles_requests.log')
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

def log_failure(target: str, datas: dict, error: Exception):
    timestamp = datetime.now(timezone.utc).isoformat()  
    with open(LOG_FILE, 'a', encoding='utf-8') as fichier:
        fichier.write(
            f"{timestamp} | {target} INSERT FAILED | "
            f"data={datas!r} | error={error}\n"
        )

@bp.route("/", methods=["GET"])
def get_articles():
    try:
        # Récupère le chemin absolu du fichier cache
        cache_path = os.path.join(os.path.dirname(__file__), "cache", "cached_articles.json")
        logger.critical("debug")
        with open(cache_path, "r", encoding="utf-8") as f:
            articles = json.load(f)

        return jsonify({"error": False, "rs": articles})

    except FileNotFoundError:
        return jsonify({"error": True, "rs": "Cache non trouvé, lancez le batch."})
    except Exception as e:
        return jsonify({"error": True, "rs": str(e)})

    
@bp.route("/search", methods=["POST"])
def search_articles():
    #cherche dans le batch pas besoin de dupliquer le modèle
    try:
        db = ArticleModel()
        searchKeys = request.json
        error, rs = db.search(searchKeys)
        return jsonify({"error": not error, "rs": rs})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})
    
#route get single article
@bp.route("/<article_id>", methods=["GET"])
def get_single_article(article_id):
    if test_mongo():
        try:
            db = ArticleModel()
            err_mongo, rs_mongo = db.get_article(article_id)
            if not err_mongo:
                raise ErrorExc("MongoDB n'a pas récupéré l'article")
            return jsonify({"error": not err_mongo, "rs": rs_mongo})
        except ErrorExc as e:
            disable_mongo()
            logger.info(f'erreur mongo {e}')
    
    if not test_mongo() and test_maria():
        try:
            db2 = ArticleModelMD()
            err_maria, rs_maria = db2.get_article(article_id)
            if not err_maria:
                raise ErrorExc("Maria n'a pas récupéré l'article")
            return jsonify({"error": not err_maria, "rs": rs_maria})
        except ErrorExc as e:
            disable_maria()
            logger.info(f'erreur maria {e}')
            return jsonify({"error": not err_maria, "message": str(e)})
        

         
#route create
@bp.route("/create", methods=["POST"])
def create_article():
    datas = request.json
    response = {"ids": {}}
    logger.critical('route create')
    mongo_id = False
    id_maria = TableArticles().getLastId()
    # MongoDB 
    if test_mongo():
        try:
            logger.critical('mongo')
            datas['id_maria'] = id_maria + 1
            err_mongo, mongo_id = ArticleModel().save_data(datas)
            if err_mongo:
                response["ids"]["mongo"] = mongo_id

        except Exception as e:
            logger.warning(f"Échec MongoDB : {e}")
            log_failure('MONGO', datas, e)
            disable_mongo()

    # MariaDB 
    if test_maria():
        logger.critical('maria')
        try:
            if not mongo_id:
                mongo_id = ObjectId()
                logger.critical(f"mon id généré {mongo_id}")
            datas_sql = datas
            datas_sql['id'] = str(mongo_id)
            err_maria, maria_id = ArticleModelMD().create(datas)
            if err_maria:
                response["ids"]["mariadb"] = maria_id

        except Exception as e:
            logger.warning(f"Échec MariaDB : {e}")
            log_failure('MARIADB', datas, e)
            disable_maria()

    # Réponse 
    if not response["ids"]:
        return jsonify({"error": True, "message": "Aucun insert n’a fonctionné."})
    return jsonify({'error': False, 'rs': response})


@bp.route("/patch/<string:id_article>", methods=["PATCH"])
def patch_article(id_article):
    datas = request.json or {}
    response = {"error": False, "updated": {}}

    # MongoDB
    try:
        err_mongo, mongo_id = ArticleModel().update_data(datas, id_article)
        if err_mongo:
            response["updated"]["mongo"] = mongo_id

    except ErrorExc as e:
        logger.warning(f"[PATCH] Échec MongoDB pour id={id_article} : {e}")
        log_failure('MONGO', {"id": id_article, **datas}, e)

    # MariaDB
    try:
        err_maria, maria_id = ArticleModelMD().update(datas, id_article)
        if err_maria:
            response["updated"]["mariadb"] = maria_id
            
    except Exception as e:
        logger.warning(f"[PATCH] Échec MariaDB pour id={id_article} : {e}")
        log_failure('MARIADB', {"id": id_article, **datas}, e)

    if not response["updated"]:
        return jsonify({"error": True, "message": "Aucune mise à jour n’a été appliquée."})

    return jsonify({"error": False, "rs": response})

    
#route delete
@bp.route("/delete/<string:id_article>", methods=["DELETE"])
def delete_article(id_article):
    try:
        db = ArticleModel()
        rs = db.delete_data(id_article)
        return jsonify({"error": not rs})
    except ErrorExc as e:
        return jsonify({"error": True, "rs": str(e)})