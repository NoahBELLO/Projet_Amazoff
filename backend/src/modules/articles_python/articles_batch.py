import json
import os
from mongoengine import connect, disconnect_all
from loguru import logger
from articles_python.articles_model import ArticleModel, ArticleModelMD
from tools.customeException import ErrorExc
from tools.db_health import test_mongo, test_maria, disable_maria, disable_mongo

def run_batch_articles():
    if test_mongo():
        try:
            db = ArticleModel()
            logger.info("Batch Mongo lancé")
            _, articles = db.get_all_articles()
            logger.critical(_)
            if not _ and len(articles) == 0:
                disable_mongo()
                raise ErrorExc("Liste articles vide")
        except ErrorExc as e:
            logger.error(f"Error Mongo {str(e)}")
    if not test_mongo() and test_maria():
            db2 = ArticleModelMD()
            logger.info('Batch Maria lancé')
            _, articles = db2.get_all_articles()
            if not _ and len(articles) == 0:
                logger.error(f"Error Maria {str(e)}")
            
    cache_dir = os.path.join(os.path.dirname(__file__), './', 'cache') #enregistre dans un dossier dans le dossier où se trouve ce script
    os.makedirs(cache_dir, exist_ok=True)

    cache_file = os.path.join(cache_dir, 'cached_articles.json')

    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    logger.info("Batch articles exécuté. Fichier sauvegardé dans cache/.")
