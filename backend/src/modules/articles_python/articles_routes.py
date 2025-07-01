from datetime import datetime, timezone
import os
from flask import Blueprint, jsonify, request, json
from loguru import logger
from articles_python.articles_model import ArticleModel
from articles_python.articles_model import ArticleModelMD
from tools.customeException import ErrorExc
from tools.db_health import test_mongo, test_maria
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

def log_failure(target: str, crud: str, datas: dict, error: Exception):
    timestamp = datetime.now(timezone.utc).isoformat()  
    with open(LOG_FILE, 'a', encoding='utf-8') as fichier:
        fichier.write(
            f"{timestamp} | {target} {crud} FAILED | "
            f"data={datas!r} | error={error}\n"
        )

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
    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_ARTICLES"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503

    try:
        db = ArticleModel()
        err_mongo, rs_mongo = db.get_article(article_id)
        if not err_mongo:
            raise ErrorExc("MongoDB n'a pas récupéré l'article")
        return jsonify({"error": not err_mongo, "rs": rs_mongo})
    except ErrorExc as e:
        logger.info(f'erreur mongo {e}')
    

    try:
        db2 = ArticleModelMD()
        err_maria, rs_maria = db2.get_article(article_id)
        if not err_maria:
            raise ErrorExc("Maria n'a pas récupéré l'article")
        return jsonify({"error": not err_maria, "rs": rs_maria})
    except ErrorExc as e:
        logger.info(f'erreur maria {e}')
        return jsonify({"error": not err_maria, "message": str(e)})
    

         
#route create
@bp.route("/create", methods=["POST"])
def create_article():
    datas = request.json
    logger.critical('route create')
    id_mongo = ObjectId()
    id_maria = False
    logger.critical(f"mon id généré {id_mongo}")
    crud_operation = "INSERT"

    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_ARTICLES"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503


    # MariaDB 
    try:
        datas_sql = datas
        datas_sql['id'] = str(id_mongo)
        err_maria, id_maria = ArticleModelMD().create(datas_sql)
        if not err_maria:
            return jsonify({"error": True, "message": "Échec de l'insertion dans MariaDB."})

    except Exception as e:
        logger.warning(f"Échec MariaDB : {e}")
        log_failure('MARIADB_ARTICLES', crud_operation, datas, e)
        return jsonify({"error": True, "message": "Échec de l'insertion dans MariaDB."})

    # MongoDB 
    try:
        logger.critical('mongo')
        datas_mongo = datas
        datas_mongo['id_maria'] = id_maria
        datas_mongo['id'] = str(id_mongo) 
        err_mongo, id_mongo = ArticleModel().save_data(datas_mongo)
        if not err_mongo:
            ArticleModelMD().delete(id_maria)  
            return jsonify({"error": True, "message": "Échec de l'insertion dans MongoDB."})

    except Exception as e:
        logger.warning(f"Échec MongoDB : {e}")
        log_failure('MONGO', crud_operation, datas, e)
        ArticleModelMD().delete(id_maria)  
        return jsonify({"error": True, "message": "Échec de l'insertion dans MongoDB."})
    
    return jsonify({"error": False, 'rs': {"id_mongo": id_mongo, "id_maria": id_maria}})



@bp.route("/patch/<string:id_article>", methods=["PATCH"])
def patch_article(id_article):
    datas = request.json
    crud_operation = "UPDATE"

    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_ARTICLES"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503

    # MongoDB 
    try:
        ok, old_doc = ArticleModel().get_article(id_article)
        if not ok:
            raise ErrorExc("Mongo : document introuvable")
        
        err_mongo, id_mongo = ArticleModel().update_data(datas, id_article)
        if not err_mongo:
            return jsonify({"error": True, "message": "Échec de l'update dans MongoDB."})

    except Exception as e:
        logger.warning(f"[PATCH] Échec MongoDB pour id={id_article} : {e}")
        log_failure('MONGO', crud_operation, {"id": id_article, **datas}, e)
        return jsonify({"error": True, "message": "Rollback Mongo, arrêt."})
        
    # MariaDB 
    try:
        err_maria, id_maria = ArticleModelMD().update(datas, id_article)
        if not err_maria:
            ArticleModel().update_data(old_doc, id_article)
            return jsonify({"error": True, "message": "Échec de l'insertion dans MariaDB."})
        
    except Exception as e:
        logger.warning(f"Échec MariaDB : {e}")
        log_failure('MARIADB', crud_operation, {"id": id_article, **datas}, e)
        try:
            ArticleModel().update_data(old_doc, id_article)
        except Exception as re:
            logger.error(f"Rollback Mongo échoué: {re}")
        return jsonify({"error": True, "message": "Rollback MariaDB, Mongo restauré."})
        
    # Réponse
    return jsonify({"error": False, 'rs': {"id_mongo": id_mongo, "id_maria": id_maria}})

    
#route delete
@bp.route("/delete/<string:id_article>", methods=["DELETE"])
def delete_article(id_article):
    crud_operation = "DELETE"
    if not (test_maria() and test_mongo(os.getenv("MONGO_URI_ARTICLES"))):
        return jsonify({"error": True, "message": "Les deux bases doivent être disponibles pour effectuer l'ajout."}), 503


     # MongoDB 
    try:
        ok, old_doc = ArticleModel().get_article(id_article)
        if not ok:
            raise ErrorExc("Mongo : document introuvable")
        
        err_mongo = ArticleModel().delete_data(id_article)
        if not err_mongo:
            return jsonify({"error": True, "message": "Échec de l'update dans MongoDB."})

    #cas erreur 500
    except Exception as e:
        logger.warning(f"[DELETE] Échec MongoDB pour id={id_article} : {e}")
        log_failure('MONGO', crud_operation, {"id": id_article}, e)
        return jsonify({"error": True, "message": "Rollback Mongo, arrêt."})


    # MariaDB 
    logger.critical('maria')
    try:
        err_maria = ArticleModelMD().delete(old_doc['id_maria'])
        if not err_maria:
            ArticleModel().save_data(old_doc)
            return jsonify({"error": True, "message": "Échec de la dans MariaDB."})
        
    #cas erreur 500
    except Exception as e:
        logger.warning(f"Échec MariaDB : {e}")
        log_failure('MARIADB', crud_operation,     {"id": old_doc['id_maria']}, e)
        try:
            ArticleModel().save_data(old_doc)
        except Exception as re:
            logger.error(f"Rollback Mongo échoué: {re}")
        return jsonify({"error": True, "message": "Rollback MariaDB, Mongo restauré."})
        

    return jsonify({'error': False})
